import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/db-mappers";
import { CartLineItem } from "@/lib/types";

/**
 * Resolves the guest cart's lightweight {productId, variantId, quantity}
 * lines into full product/variant details + a trustworthy subtotal — the
 * client never stores prices itself. Silently drops lines whose product or
 * variant no longer exists (e.g. deleted from the admin) rather than
 * failing the whole cart.
 */
export async function POST(req: NextRequest) {
  const { items } = (await req.json()) as { items: CartLineItem[] };
  if (!items || items.length === 0) {
    return NextResponse.json({ lines: [], subtotal: 0 });
  }

  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true }
  });
  const productById = new Map(products.map((p) => [p.id, mapProduct(p)]));

  const lines = items
    .map((item) => {
      const product = productById.get(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (!product || !variant) return null;
      return { product, variant, quantity: item.quantity };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);

  return NextResponse.json({ lines, subtotal });
}
