import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createPrint, CreatePrintInput } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreatePrintInput;

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Вкажіть назву принта." }, { status: 400 });
  }
  if (!body.image) {
    return NextResponse.json({ error: "Додайте фото принта." }, { status: 400 });
  }

  try {
    const print = await createPrint({
      name: body.name.trim(),
      description: body.description?.trim() ?? "",
      category: body.category,
      image: body.image,
      showOnHome: !!body.showOnHome
    });
    revalidatePath("/", "layout"); // одразу оновити кеш сайту
    return NextResponse.json(print, { status: 201 });
  } catch (err) {
    console.error("[admin/prints] create failed:", err);
    return NextResponse.json({ error: "Не вдалося створити принт." }, { status: 500 });
  }
}
