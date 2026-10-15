import { NextRequest, NextResponse } from "next/server";
import { createProduct, CreateProductInput } from "@/lib/data";
import { getTemplate } from "@/lib/product-templates";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateProductInput;

  if (!body.name || !body.description || !body.baseCategory) {
    return NextResponse.json({ error: "Заповніть назву, опис і категорію." }, { status: 400 });
  }
  if (!body.images || body.images.length === 0) {
    return NextResponse.json({ error: "Додайте хоча б одне фото." }, { status: 400 });
  }
  if (!Array.isArray(body.groups) || body.groups.length === 0) {
    return NextResponse.json({ error: "Вкажіть ціну та кольори." }, { status: 400 });
  }
  for (const g of body.groups) {
    if (!g.price || g.price <= 0) {
      return NextResponse.json({ error: "Вкажіть ціну для кожного типу тканини." }, { status: 400 });
    }
    if (!g.colors || g.colors.length === 0) {
      return NextResponse.json({ error: "Оберіть хоча б один колір для кожного типу тканини." }, { status: 400 });
    }
    if (g.salePrice !== undefined && g.salePrice !== null && (g.salePrice <= 0 || g.salePrice >= g.price)) {
      return NextResponse.json({ error: "Акційна ціна має бути меншою за звичайну." }, { status: 400 });
    }
  }
  if (body.onSale && !body.groups.some((g) => g.salePrice && g.salePrice > 0)) {
    return NextResponse.json({ error: "Вкажіть акційну ціну хоча б для однієї тканини." }, { status: 400 });
  }
  if (body.productType && !getTemplate(body.productType)) {
    return NextResponse.json({ error: "Невідомий тип товару." }, { status: 400 });
  }
  if (!body.productType && body.baseCategory === "t-shirts" && !body.cutStyle) {
    return NextResponse.json({ error: "Оберіть крій: класичний чи оверсайз." }, { status: 400 });
  }

  try {
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("[admin/products] create failed:", err);
    return NextResponse.json({ error: "Не вдалося створити товар." }, { status: 500 });
  }
}
