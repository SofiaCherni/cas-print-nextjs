import {
  Prisma,
  Variant as DbVariant,
  ProductBaseCategory as DbBaseCategory,
  CutStyle as DbCutStyle,
  Fit as DbFit
} from "@prisma/client";
import { CutStyle, Fit, Product, ProductBaseCategory, Size, Variant } from "./types";

/**
 * Converts between Prisma's DB shapes (uppercase enums, flat colorName/
 * colorHex fields) and the app's existing types in lib/types.ts (lowercase
 * string unions, nested color object) — so every page/component built
 * against lib/types.ts keeps working unchanged now that the data comes from
 * Postgres instead of an in-memory array.
 */

const BASE_CATEGORY_FROM_DB: Record<DbBaseCategory, ProductBaseCategory> = {
  T_SHIRTS: "t-shirts",
  SWEATSHIRTS: "sweatshirts",
  HOODIES: "hoodies",
  BASICS: "basics"
};

const BASE_CATEGORY_TO_DB: Record<ProductBaseCategory, DbBaseCategory> = {
  "t-shirts": "T_SHIRTS",
  sweatshirts: "SWEATSHIRTS",
  hoodies: "HOODIES",
  basics: "BASICS"
};

const FIT_FROM_DB: Record<DbFit, Fit> = { UNISEX: "unisex", WOMEN: "women" };
const FIT_TO_DB: Record<Fit, DbFit> = { unisex: "UNISEX", women: "WOMEN" };

const CUT_STYLE_FROM_DB: Record<DbCutStyle, CutStyle> = { CLASSIC: "classic", OVERSIZE: "oversize" };
const CUT_STYLE_TO_DB: Record<CutStyle, DbCutStyle> = { classic: "CLASSIC", oversize: "OVERSIZE" };

export function baseCategoryToDb(v: ProductBaseCategory): DbBaseCategory {
  return BASE_CATEGORY_TO_DB[v];
}
export function fitToDb(v: Fit): DbFit {
  return FIT_TO_DB[v];
}
export function cutStyleToDb(v: CutStyle): DbCutStyle {
  return CUT_STYLE_TO_DB[v];
}

type DbProductWithVariants = Prisma.ProductGetPayload<{ include: { variants: true } }>;

export function mapVariant(v: DbVariant): Variant {
  return {
    id: v.id,
    size: v.size as Size,
    fit: FIT_FROM_DB[v.fit],
    color: { name: v.colorName, hex: v.colorHex },
    price: v.price,
    stockQty: v.stockQty,
    sku: v.sku
  };
}

export function mapProduct(p: DbProductWithVariants): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    baseCategory: BASE_CATEGORY_FROM_DB[p.baseCategory],
    cutStyle: p.cutStyle ? CUT_STYLE_FROM_DB[p.cutStyle] : undefined,
    printCategory: p.printCategory ?? undefined,
    basePrice: p.basePrice,
    images: p.images,
    variants: p.variants.map(mapVariant),
    popular: p.popular,
    status: p.status as "active" | "hidden",
    onSale: p.onSale,
    salePrice: p.salePrice ?? undefined,
    createdAt: p.createdAt.toISOString()
  };
}
