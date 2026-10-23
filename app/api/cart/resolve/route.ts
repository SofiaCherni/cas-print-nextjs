import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/db-mappers";
import { CartLineItem } from "@/lib/types";
import { variantPrice } from "@/lib/pricing";

/**
 * Resolves the guest cart's lightweight {productId, variantId, quantity}
 * lines into full product/variant details + a trustworthy subtotal — the
 * client never stores prices itself. Silently drops lines whose product or
 * variant no longer exists or is hidden (e.g. deleted/hidden in the admin) rather than
 * failing the whole cart.
 */
export async function POST(req: NextRequest) {
  let items: CartLineItem[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.items)) items = body.items.slice(0, 50);
  } catch {
    // некоректне тіло запиту — трактуємо як порожній кошик
  }
  items = items.filter(
    (i) =>
      typeof i?.productId === "string" &&
      typeof i?.variantId === "string" &&
      Number.isInteger(i?.quantity) &&
      i.quantity >= 1 &&
      i.quantity <= 99
  );
  if (items.length === 0) {
    return NextResponse.json({ lines: [], subtotal: 0 });
  }

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true }
  });
  // Приховані товари з кошика прибираються так само, як видалені — замовити їх все одно не вийде.
  const productById = new Map(products.filter((p) => p.status === "active").map((p) => [p.id, mapProduct(p)]));

  const lines = items
    .map((item) => {
      const product = productById.get(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return { product, variant, quantity: item.quantity };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + variantPrice(l.product, l.variant) * l.quantity, 0);

  return NextResponse.json({ lines, subtotal });
}
