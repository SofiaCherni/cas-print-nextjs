import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, generateOrderNumber } from "@/lib/data";
import { CartLineItem } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { sendEmail, orderNotificationEmail } from "@/lib/email";

interface CheckoutBody {
  items: CartLineItem[];
  contact: {
    lastName: string;
    firstName: string;
    patronymic: string;
    phone: string;
    contactMethod: "viber" | "telegram" | "whatsapp";
  };
  delivery: { city: string; postomatNumber: string };
  comment?: string;
}

/**
 * Re-validates price, stock and the selected variant against the (mock)
 * product catalog before creating an order — the frontend price is never
 * trusted (brief section 24/26). The order IS persisted for real in
 * Postgres via Prisma and triggers a notification email to the shop.
 *
 * No online payment yet by design (brief update): payment method is agreed
 * with the customer over Viber/Telegram/WhatsApp after the order is placed,
 * per the current "Доставка та оплата" policy (full prepayment online is
 * listed there as a *future* option, not wired into checkout yet).
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutBody;

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Кошик порожній." }, { status: 400 });
  }
  const { lastName, firstName, phone, contactMethod } = body.contact ?? {};
  if (!lastName || !firstName || !phone || !contactMethod) {
    return NextResponse.json({ error: "Заповніть особисті дані та спосіб звʼязку." }, { status: 400 });
  }
  if (!body.delivery?.city || !body.delivery?.postomatNumber) {
    return NextResponse.json({ error: "Заповніть місто та номер поштомата." }, { status: 400 });
  }

  let subtotal = 0;
  const validatedItems: { variantId: string; quantity: number; price: number }[] = [];

  for (const line of body.items) {
    const product = PRODUCTS.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) {
      return NextResponse.json({ error: "Один із товарів більше недоступний." }, { status: 409 });
    }
    if (variant.stockQty < line.quantity) {
      return NextResponse.json(
        { error: `Недостатньо товару «${product.name}» на складі.` },
        { status: 409 }
      );
    }
    subtotal += variant.price * line.quantity; // server-computed, not client-supplied
    validatedItems.push({ variantId: variant.id, quantity: line.quantity, price: variant.price });
  }

  const orderNumber = generateOrderNumber();

  try {
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        firstName,
        lastName,
        patronymic: body.contact.patronymic || undefined
      },
      create: {
        firstName,
        lastName,
        patronymic: body.contact.patronymic || undefined,
        phone
      }
    });

    await prisma.address.create({
      data: {
        customerId: customer.id,
        carrier: "nova-poshta",
        city: body.delivery.city,
        postomatNumber: body.delivery.postomatNumber
      }
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "NEW",
        subtotal,
        total: subtotal, // delivery cost — за тарифами Нової Пошти, уточнюється окремо
        contactMethod,
        comment: body.comment || undefined,
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

    const notifyEmail = process.env.ORDERS_NOTIFICATION_EMAIL;
    if (notifyEmail) {
      await sendEmail({
        to: notifyEmail,
        subject: `Нове замовлення №${orderNumber}`,
        html: orderNotificationEmail(orderNumber, subtotal, phone, contactMethod, body.comment)
      });
    }

    return NextResponse.json({ orderNumber: order.orderNumber, subtotal, status: order.status }, { status: 201 });
  } catch (err) {
    console.error("[checkout] failed to persist order:", err);
    return NextResponse.json(
      { error: "Не вдалося зберегти замовлення. Спробуйте ще раз або зв'яжіться з нами напряму." },
      { status: 500 }
    );
  }
}
