import { NextRequest, NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/db-mappers";
import { variantPrice } from "@/lib/pricing";
import { sendEmail, orderNotificationEmail } from "@/lib/email";

const MAX_LINES = 50;
const MAX_QUANTITY = 99;
const CONTACT_METHODS = ["viber", "telegram", "whatsapp"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}'’ʼ\- .]*$/u;
const POSTOMAT_RE = /^[\p{L}\p{N}№#\- ]+$/u;

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

/** Обрізає пробіли; повертає null, якщо це не рядок або довжина поза межами. */
function cleanText(value: unknown, max: number, min = 1): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v.length >= min && v.length <= max ? v : null;
}

/**
 * Нормалізує телефон до «+380XXXXXXXXX» (для українських номерів) або «+цифри»
 * (інші), щоб один клієнт не дублювався у різних форматах запису.
 */
function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 30) return null;
  if (!/^[+\d\s()\-.]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) return `+38${digits}`;
  if (digits.length === 12 && digits.startsWith("380")) return `+${digits}`;
  if (digits.length < 10 || digits.length > 15) return null;
  return `+${digits}`;
}

interface ParsedLine {
  productId: string;
  variantId: string;
  quantity: number;
}

/** Перевіряє рядки кошика: формат, кількість — ціле 1..99; однакові варіанти зливає в один рядок. */
function parseItems(raw: unknown): ParsedLine[] | string {
  if (!Array.isArray(raw) || raw.length === 0) return "Кошик порожній.";
  if (raw.length > MAX_LINES) return "Забагато позицій у кошику.";

  const byVariant = new Map<string, ParsedLine>();
  for (const item of raw) {
    const productId = cleanText((item as ParsedLine | null)?.productId, 100);
    const variantId = cleanText((item as ParsedLine | null)?.variantId, 100);
    const quantity: unknown = (item as ParsedLine | null)?.quantity;
    if (!productId || !variantId) return "Некоректний товар у кошику.";
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return `Кількість товару має бути від 1 до ${MAX_QUANTITY}.`;
    }
    const existing = byVariant.get(variantId);
    if (existing) {
      if (existing.productId !== productId) return "Некоректний товар у кошику.";
      existing.quantity += quantity;
      if (existing.quantity > MAX_QUANTITY) return `Кількість товару має бути від 1 до ${MAX_QUANTITY}.`;
    } else {
      byVariant.set(variantId, { productId, variantId, quantity });
    }
  }
  return [...byVariant.values()];
}

/**
 * Re-validates price, stock and the selected variant against the product
 * catalog before creating an order — the frontend price is never trusted
 * (brief section 24/26). Each line's price is recomputed here from the
 * database (variant price incl. size surcharge, minus any active sale via
 * lib/pricing.ts); only productId / variantId / quantity are taken from the
 * browser, and hidden products can't be ordered. The order IS persisted for
 * real in Postgres via Prisma and triggers a notification email to the shop.
 *
 * No online payment yet by design (brief update): payment method is agreed
 * with the customer over Viber/Telegram/WhatsApp after the order is placed,
 * per the current "Доставка та оплата" policy (full prepayment online
 * is listed there as a *future* option, not wired into checkout yet).
 */
export async function POST(req: NextRequest) {
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Некоректний запит.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return badRequest("Некоректний запит.");

  if (body.consent !== true) {
    return badRequest("Потрібна згода на обробку персональних даних.");
  }

  const parsedItems = parseItems(body.items);
  if (typeof parsedItems === "string") return badRequest(parsedItems);

  const contactIn = body.contact ?? {};
  const lastName = cleanText(contactIn.lastName, 60);
  const firstName = cleanText(contactIn.firstName, 60);
  const phone = normalizePhone(contactIn.phone);
  const contactMethod = CONTACT_METHODS.find((m) => m === contactIn.contactMethod) as ContactMethod | undefined;
  if (!lastName || !firstName || !contactMethod) {
    return badRequest("Заповніть особисті дані та спосіб звʼязку.");
  }
  if (!NAME_RE.test(lastName) || !NAME_RE.test(firstName)) {
    return badRequest("Прізвище та імʼя мають містити лише літери.");
  }
  let patronymic: string | undefined;
  if (contactIn.patronymic !== undefined && contactIn.patronymic !== null && contactIn.patronymic !== "") {
    const p = cleanText(contactIn.patronymic, 60);
    if (!p || !NAME_RE.test(p)) return badRequest("По батькові має містити лише літери.");
    patronymic = p;
  }
  if (!phone) return badRequest("Вкажіть коректний номер телефону.");

  const city = cleanText(body.delivery?.city, 100);
  const postomatNumber = cleanText(body.delivery?.postomatNumber, 20);
  if (!city || !postomatNumber) {
    return badRequest("Заповніть місто та номер поштомата.");
  }
  if (!POSTOMAT_RE.test(postomatNumber)) return badRequest("Некоректний номер поштомата.");

  let comment: string | undefined;
  if (body.comment !== undefined && body.comment !== null && body.comment !== "") {
    const c = cleanText(body.comment, 500);
    if (!c) return badRequest("Коментар занадто довгий (до 500 символів).");
    comment = c;
  }

  let subtotal = 0;
  const validatedItems: { variantId: string; quantity: number; price: number }[] = [];

  const productIds = [...new Set(parsedItems.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true }
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  for (const line of parsedItems) {
    const product = productById.get(line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    // Прихований товар замовити не можна, навіть якщо id відомий.
    if (!product || product.status !== "active" || !variant) {
      return NextResponse.json({ error: "Один із товарів більше недоступний." }, { status: 409 });
    }
    if (variant.stockQty < line.quantity) {
      return NextResponse.json(
        { error: `Недостатньо товару «${product.name}» на складі.` },
        { status: 409 }
      );
    }
    // Ціна з урахуванням акції — рахується на сервері, не береться від клієнта.
    const mapped = mapProduct(product);
    const mappedVariant = mapped.variants.find((v) => v.id === variant.id)!;
    const unitPrice = variantPrice(mapped, mappedVariant);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return NextResponse.json({ error: "Один із товарів більше недоступний." }, { status: 409 });
    }
    subtotal += unitPrice * line.quantity;
    validatedItems.push({ variantId: variant.id, quantity: line.quantity, price: unitPrice });
  }

  const orderNumber = generateOrderNumber();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { phone },
        update: {
          firstName,
          lastName,
          patronymic
        },
        create: {
          firstName,
          lastName,
          patronymic,
          phone
        }
      });

      await tx.address.create({
        data: {
          customerId: customer.id,
          carrier: "nova-poshta",
          city,
          postomatNumber
        }
      });

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: "NEW",
          subtotal,
          total: subtotal, // delivery cost — за тарифами Нової Пошти, уточнюється окремо
          contactMethod,
          comment,
          paymentStatus: "pending",
          items: {
            create: validatedItems.map((i) => ({
              variantId: i.variantId,
              quantity: i.quantity,
              priceAtOrder: i.price
            }))
          }
        }
      });

      // Reserve stock now that the order is confirmed — re-checked against
      // the latest count inside the same transaction to avoid overselling
      // if two people order the last item at once.
      for (const i of validatedItems) {
        const updated = await tx.variant.updateMany({
          where: { id: i.variantId, stockQty: { gte: i.quantity } },
          data: { stockQty: { decrement: i.quantity } }
        });
        if (updated.count === 0) {
          throw new Error(`OUT_OF_STOCK:${i.variantId}`);
        }
      }

      return createdOrder;
    });

    // Замовлення вже збережене — збій пошти не повинен перетворюватись на помилку для клієнта
    // (інакше він повторить замовлення, і товар спишеться двічі).
    const notifyEmail = process.env.ORDERS_NOTIFICATION_EMAIL;
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `Нове замовлення №${orderNumber}`,
          html: orderNotificationEmail(orderNumber, subtotal, phone, contactMethod, comment)
        });
      } catch (err) {
        console.error("[checkout] order saved, but notification email failed:", err);
      }
    }

    return NextResponse.json({ orderNumber: order.orderNumber, subtotal, status: order.status }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("OUT_OF_STOCK:")) {
      return NextResponse.json(
        { error: "Хтось щойно забрав останню одиницю цього товару. Онови кошик і спробуй ще раз." },
        { status: 409 }
      );
    }
    console.error("[checkout] failed to persist order:", err);
    return NextResponse.json(
      { error: "Не вдалося зберегти замовлення. Спробуйте ще раз або зв'яжіться з нами напряму." },
      { status: 500 }
    );
  }
}
