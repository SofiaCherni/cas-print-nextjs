import { NextRequest, NextResponse } from "next/server";
import { getPrints } from "@/lib/data";
import { PrintCategory } from "@/lib/types";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") as PrintCategory | null;
  const all = await getPrints();
  const items = category ? all.filter((p) => p.category === category) : all;
  return NextResponse.json({ items });
}
