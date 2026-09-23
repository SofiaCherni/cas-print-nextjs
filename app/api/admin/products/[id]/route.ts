import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, setProductStatus } from "@/lib/data";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (status !== "active" && status !== "hidden") {
    return NextResponse.json({ error: "Невірний статус." }, { status: 400 });
  }
  try {
    await setProductStatus(params.id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products] status update failed:", err);
    return NextResponse.json({ error: "Не вдалося оновити товар." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products] delete failed:", err);
    return NextResponse.json({ error: "Не вдалося видалити товар." }, { status: 500 });
  }
}
