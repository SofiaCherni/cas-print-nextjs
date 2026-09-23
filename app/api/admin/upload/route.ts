import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB per photo

/**
 * Uploads one product photo to Vercel Blob (same storage already used for
 * custom-print requests) and returns its public URL. Called once per file
 * from the "Додати товар" form.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Файл не додано." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Дозволені формати: PNG, JPG, WEBP." }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Фото завелике (максимум 8 МБ)." }, { status: 413 });
  }

  try {
    const blob = await put(`products/${Date.now()}-${file.name}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (err) {
    console.error("[admin/upload] failed:", err);
    return NextResponse.json({ error: "Не вдалося завантажити фото." }, { status: 500 });
  }
}
