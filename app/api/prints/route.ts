import { NextRequest, NextResponse } from "next/server";
import { getPrintCategories } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");

    const all = await getPrintCategories();

    const items = category
      ? all.filter(
          (item) => item.toLowerCase() === category.toLowerCase()
        )
      : all;

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/prints error:", error);

    return NextResponse.json(
      { error: "Не вдалося завантажити категорії принтів." },
      { status: 500 }
    );
  }
}
