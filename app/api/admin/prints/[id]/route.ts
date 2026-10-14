import { NextRequest, NextResponse } from "next/server";
import { deletePrint, updatePrint } from "@/lib/data";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, showOnHome } = await req.json();

  const data: { status?: "active" | "hidden"; showOnHome?: boolean } = {};
  if (status !== undefined) {
    if (status !== "active" && status !== "hidden") {
      return NextResponse.json({ error: "Невірний статус." }, { status: 400 });
    }
    data.status = status;
  }
  if (showOnHome !== undefined) {
    if (typeof showOnHome !== "boolean") {
      return NextResponse.json({ error: "Невірне значення." }, { status: 400 });
    }
    data.showOnHome = showOnHome;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Нічого оновлювати." }, { status: 400 });
  }

  try {
    await updatePrint(params.id, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/prints] update failed:", err);
    return NextResponse.json({ error: "Не вдалося оновити принт." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deletePrint(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/prints] delete failed:", err);
    return NextResponse.json({ error: "Не вдалося видалити принт." }, { status: 500 });
  }
}
