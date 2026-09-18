import { NextRequest, NextResponse } from "next/server";
import { PRINTS } from "@/lib/data";
import { PrintCategory } from "@/lib/types";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") as PrintCategory | null;
  const items = category ? PRINTS.filter((p) => p.category === category) : PRINTS;
  return NextResponse.json({ items });
}
