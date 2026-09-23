import { NextRequest, NextResponse } from "next/server";
import { createProduct, CreateProductInput } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateProductInput;

  if (!body.name || !body.description || !body.baseCategory || !body.basePrice) {
    return NextResponse.json({ error: "Заповніть назву, опис, категорію та ціну." }, { status: 400 });
  }
  if (!body.images || body.images.length === 0) {
    return NextResponse.json({ error: "Додайте хоча б одне фото." }, { status: 400 });
  }
  if (!body.fits || body.fits.length === 0) {
    return NextResponse.json({ error: "Оберіть хоча б один фасон." }, { status: 400 });
  }
  if (!body.colors || body.colors.length === 0) {
    return NextResponse.json({ error: "Оберіть хоча б один колір." }, { status: 400 });
  }
  if (body.onSale && (!body.salePrice || body.salePrice <= 0)) {
    return NextResponse.json({ error: "Вкажіть акційну ціну." }, { status: 400 });
  }

  try {
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("[admin/products] create failed:", err);
    return NextResponse.json({ error: "Не вдалося створити товар." }, { status: 500 });
  }
}
