import { NextRequest, NextResponse } from "next/server";
import { queryProducts, CatalogQuery } from "@/lib/data";
import { Fit, ProductBaseCategory, PrintCategory, Size } from "@/lib/types";

/**
 * GET /api/products?category=&printCategory=&size=&color=&fit=&minPrice=&maxPrice=&sort=&page=
 * Mirrors the catalog URL query params (brief section 22) so the frontend
 * and this endpoint always agree on filter shape.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const query: CatalogQuery = {
    baseCategory: (sp.get("category") as ProductBaseCategory) ?? undefined,
    printCategory: (sp.get("printCategory") as PrintCategory) ?? undefined,
    size: (sp.get("size") as Size) ?? undefined,
    fit: (sp.get("fit") as Fit) ?? undefined,
    colorName: sp.get("color") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    sort: (sp.get("sort") as CatalogQuery["sort"]) ?? "popular",
    page: sp.get("page") ? Number(sp.get("page")) : 1
  };
  const result = await queryProducts(query);
  return NextResponse.json(result);
}
