import { NextResponse } from "next/server";
import { getPrintCategories } from "@/lib/data";

/** Existing print category names (across all products, hidden included) —
 * feeds the datalist in "Додати товар" so typing "Аніме" again suggests the
 * one already in use instead of creating a near-duplicate. */
export async function GET() {
  const categories = await getPrintCategories(true);
  return NextResponse.json({ categories });
}
