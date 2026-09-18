import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return NextResponse.json({ error: "Товар не знайдено" }, { status: 404 });
  }
  return NextResponse.json(product);
}
