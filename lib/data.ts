import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { baseCategoryToDb, fitToDb, mapPrint, mapProduct, printCategoryToDb } from "./db-mappers";
import { Fit, Print, PrintCategory, Product, ProductBaseCategory, Size } from "./types";
import {
  BASE_CATEGORIES,
  COLOR_PALETTE,
  formatPrice,
  generateOrderNumber,
  PRINT_CATEGORIES
} from "./catalog-constants";

/**
 * DATA LAYER — now backed by Postgres via Prisma (see prisma/schema.prisma).
 * Function names/shapes match what every page already expects (see
 * lib/db-mappers.ts for the DB <-> app-type conversion), so pages only
 * needed an `await` added at each call site, not a rewrite.
 *
 * Pure constants/helpers (no Prisma import) live in lib/catalog-constants.ts
 * and are re-exported here for server-side code; client components import
 * straight from lib/catalog-constants to avoid bundling Prisma.
 */
export { BASE_CATEGORIES, COLOR_PALETTE, formatPrice, generateOrderNumber, PRINT_CATEGORIES };

const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const EXTENDED_SIZE_SURCHARGE = 50;

export interface CatalogQuery {
  baseCategory?: ProductBaseCategory;
  printCategory?: PrintCategory;
  size?: Size;
  fit?: Fit;
  colorName?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "popular" | "new" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}

function buildWhere(query: CatalogQuery, includeHidden: boolean): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = includeHidden ? {} : { status: "active" };

  if (query.baseCategory) where.baseCategory = baseCategoryToDb(query.baseCategory);
  if (query.printCategory) {
    where.print = { category: printCategoryToDb(query.printCategory) };
  }
  if (typeof query.minPrice === "number" || typeof query.maxPrice === "number") {
    const range: { gte?: number; lte?: number } = {};
    if (typeof query.minPrice === "number") range.gte = query.minPrice;
    if (typeof query.maxPrice === "number") range.lte = query.maxPrice;
    where.basePrice = range;
  }

  const variantFilters: Prisma.VariantWhereInput = {};
  if (query.size) variantFilters.size = query.size;
  if (query.fit) variantFilters.fit = fitToDb(query.fit);
  if (query.colorName) variantFilters.colorName = query.colorName;
  if (Object.keys(variantFilters).length > 0) {
    where.variants = { some: variantFilters };
  }

  return where;
}

/**
 * Server-side filtering + pagination against Postgres — mirrors the same
 * filter shape the catalog URL query params and /api/products already use.
 */
export async function queryProducts(query: CatalogQuery, includeHidden = false) {
  const where = buildWhere(query, includeHidden);

  const orderBy =
    query.sort === "new"
      ? [{ createdAt: "desc" as const }]
      : query.sort === "price-asc"
      ? [{ basePrice: "asc" as const }]
      : query.sort === "price-desc"
      ? [{ basePrice: "desc" as const }]
      : [{ popular: "desc" as const }, { createdAt: "desc" as const }];

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where })
  ]);

  return { items: rows.map(mapProduct), total, page, pageSize };
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { slug }, include: { variants: true } });
  return row ? mapProduct(row) : undefined;
}

export async function getPrint(printId: string | null): Promise<Print | undefined> {
  if (!printId) return undefined;
  const row = await prisma.print.findUnique({ where: { id: printId }, include: { products: true } });
  return row ? mapPrint(row) : undefined;
}

export async function getPrints(): Promise<Print[]> {
  const rows = await prisma.print.findMany({ include: { products: true }, orderBy: { createdAt: "desc" } });
  return rows.map(mapPrint);
}

export async function getPopularProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: "active", popular: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return rows.map(mapProduct);
}

export async function getSaleProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: "active", onSale: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" }
  });
  return rows.map(mapProduct);
}

/** Full list for the admin products table — includes hidden products. */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" }
  });
  return rows.map(mapProduct);
}

/** Lightweight slug + date list for sitemap.ts. */
export async function getAllProductSlugs(): Promise<{ slug: string; createdAt: Date }[]> {
  return prisma.product.findMany({
    where: { status: "active" },
    select: { slug: true, createdAt: true }
  });
}

export async function getCatalogCounts() {
  const [products, prints] = await Promise.all([prisma.product.count(), prisma.print.count()]);
  return { products, prints };
}

export async function searchCatalog(q: string) {
  const term = q.trim();
  if (!term) return { products: [] as Product[], prints: [] as Print[], categories: [] as typeof PRINT_CATEGORIES };
  const [productRows, printRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "active",
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } }
        ]
      },
      include: { variants: true },
      take: 20
    }),
    prisma.print.findMany({
      where: { name: { contains: term, mode: "insensitive" } },
      include: { products: true },
      take: 20
    })
  ]);
  const categories = PRINT_CATEGORIES.filter((c) => c.label.toLowerCase().includes(term.toLowerCase()));
  return { products: productRows.map(mapProduct), prints: printRows.map(mapPrint), categories };
}

// ---------------------------------------------------------------------------
// Admin: create / update / delete products (used by /admin/products/new and
// the hide/show + delete actions on /admin/products).
// ---------------------------------------------------------------------------

export interface CreateProductInput {
  name: string;
  description: string;
  baseCategory: ProductBaseCategory;
  basePrice: number;
  images: string[];
  fits: Fit[];
  colors: { name: string; hex: string }[];
  popular: boolean;
  onSale: boolean;
  salePrice?: number;
}

function slugify(name: string): string {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
    з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
    о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": ""
  };
  const transliterated = name
    .toLowerCase()
    .split("")
    .map((ch) => translit[ch] ?? ch)
    .join("");
  return (
    transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product"
  );
}

/**
 * Creates a product plus one Variant per (fit × size × color) combination —
 * same generation rule the original mock catalog used, including the
 * +50₴ surcharge on 3XL–5XL (brief section 6 / product page notice).
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const variantsData = [];
  for (const fit of input.fits) {
    for (const size of ALL_SIZES) {
      for (const color of input.colors) {
        const extended = size === "3XL" || size === "4XL" || size === "5XL";
        variantsData.push({
          size,
          fit: fitToDb(fit),
          colorName: color.name,
          colorHex: color.hex,
          price: extended ? input.basePrice + EXTENDED_SIZE_SURCHARGE : input.basePrice,
          stockQty: 20,
          sku: `${slug}-${fit}-${size}-${color.name}`.toUpperCase().replace(/\s+/g, "")
        });
      }
    }
  }

  const row = await prisma.product.create({
    data: {
      slug,
      name: input.name,
      description: input.description,
      baseCategory: baseCategoryToDb(input.baseCategory),
      basePrice: input.basePrice,
      images: input.images,
      popular: input.popular,
      onSale: input.onSale,
      salePrice: input.onSale ? input.salePrice : null,
      variants: { create: variantsData }
    },
    include: { variants: true }
  });

  return mapProduct(row);
}

export async function setProductStatus(id: string, status: "active" | "hidden") {
  await prisma.product.update({ where: { id }, data: { status } });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
