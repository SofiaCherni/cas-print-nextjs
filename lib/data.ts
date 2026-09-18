import { Print, PrintCategory, Product, ProductBaseCategory, Size, Fit } from "./types";

/**
 * MOCK DATA LAYER
 * ----------------
 * This file stands in for the real database (see prisma/schema.prisma for the
 * intended production schema: products, variants, prints, orders, etc).
 * Replace these arrays and helper functions with real Prisma/DB queries when
 * a database is connected. Nothing here should be treated as real CAS-Print
 * catalog data — it exists to make the prototype browsable end to end.
 */

const COLORS = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Молочний", hex: "#F2F0EB" },
  { name: "Сірий", hex: "#8A8A8A" },
  { name: "Теракотовий", hex: "#B3402E" },
  { name: "Хакі", hex: "#2F3B2A" }
];

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

export const PRINT_CATEGORIES: { value: PrintCategory; label: string }[] = [
  { value: "anime", label: "Аніме" },
  { value: "text", label: "Текст" },
  { value: "memes", label: "Меми" },
  { value: "ukrainian", label: "Українське" },
  { value: "cartoons", label: "Мультфільми" },
  { value: "movies", label: "Кіно" },
  { value: "music", label: "Музика" },
  { value: "other", label: "Інше" }
];

export const BASE_CATEGORIES: { value: ProductBaseCategory; label: string; slug: string }[] = [
  { value: "t-shirts", label: "Футболки", slug: "t-shirts" },
  { value: "hoodies", label: "Худі", slug: "hoodies" },
  { value: "basics", label: "Базові речі", slug: "basics" }
];

export const PRINTS: Print[] = [
  {
    id: "print-sakura",
    name: "Сакура",
    category: "anime",
    image: "/assets/placeholder-print.svg",
    description: "Ілюстрація в аніме-стилі.",
    status: "active",
    availableProductIds: ["p-tshirt-sakura", "p-hoodie-sakura"]
  },
  {
    id: "print-zaraz-yak-dam",
    name: "Зараз як дам",
    category: "ukrainian",
    image: "/assets/placeholder-print.svg",
    description: "Український принт із народним мотивом.",
    status: "active",
    availableProductIds: ["p-hoodie-zaraz"]
  },
  {
    id: "print-meme-oversize",
    name: "Оверсайз мем",
    category: "memes",
    image: "/assets/placeholder-print.svg",
    description: "Популярний мем-принт.",
    status: "active",
    availableProductIds: ["p-tshirt-meme"]
  },
  {
    id: "print-text-napys",
    name: "Напис",
    category: "text",
    image: "/assets/placeholder-print.svg",
    description: "Типографічний принт.",
    status: "active",
    availableProductIds: ["p-hoodie-text"]
  },
  {
    id: "print-cartoon",
    name: "Мультфільм",
    category: "cartoons",
    image: "/assets/placeholder-print.svg",
    description: "Принт із мотивами мультфільму.",
    status: "active",
    availableProductIds: ["p-tshirt-cartoon"]
  },
  {
    id: "print-movie",
    name: "Кіно",
    category: "movies",
    image: "/assets/placeholder-print.svg",
    description: "Кіно-принт.",
    status: "active",
    availableProductIds: ["p-tshirt-movie"]
  }
];

function makeVariants(basePrice: number, printId: string, fits: Fit[] = ["unisex"]) {
  const variants = [];
  let i = 0;
  for (const fit of fits) {
    for (const size of SIZES) {
      for (const color of COLORS) {
        i++;
        const isExtended = size === "3XL" || size === "4XL" || size === "5XL";
        variants.push({
          id: `${printId}-${fit}-${size}-${color.name}`,
          size,
          fit,
          color,
          price: isExtended ? basePrice + 50 : basePrice,
          stockQty: 20,
          sku: `${printId.toUpperCase()}-${fit[0].toUpperCase()}-${size}-${i}`
        });
      }
    }
  }
  return variants;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-tshirt-sakura",
    slug: "futbolka-sakura",
    name: "Футболка «Сакура»",
    description:
      "Пряма футболка щільністю 180 г/м² з принтом «Сакура». Бавовна 100%.",
    baseCategory: "t-shirts",
    printId: "print-sakura",
    basePrice: 890,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(890, "sakura", ["unisex", "women"]),
    popular: true,
    createdAt: "2026-06-01"
  },
  {
    id: "p-hoodie-sakura",
    slug: "hudi-sakura",
    name: "Худі «Сакура»",
    description: "Оверсайз худі з флісу 350 г/м² з принтом «Сакура».",
    baseCategory: "hoodies",
    printId: "print-sakura",
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(1690, "sakura-hoodie", ["unisex"]),
    createdAt: "2026-06-01"
  },
  {
    id: "p-hoodie-zaraz",
    slug: "hudi-zaraz-yak-dam",
    name: "Худі «Зараз як дам»",
    description:
      "Оверсайз худі з щільного флісу 350 г/м². Принт на основі авторської ілюстрації в українській тематиці.",
    baseCategory: "hoodies",
    printId: "print-zaraz-yak-dam",
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(1690, "zaraz", ["unisex"]),
    popular: true,
    createdAt: "2026-07-10"
  },
  {
    id: "p-tshirt-meme",
    slug: "futbolka-oversize-mem",
    name: "Футболка «Оверсайз мем»",
    description: "Оверсайзна футболка з популярним мем-принтом.",
    baseCategory: "t-shirts",
    printId: "print-meme-oversize",
    basePrice: 890,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(890, "meme", ["unisex", "women"]),
    popular: true,
    createdAt: "2026-05-20"
  },
  {
    id: "p-hoodie-text",
    slug: "hudi-napys",
    name: "Худі «Напис»",
    description: "Худі з типографічним принтом.",
    baseCategory: "hoodies",
    printId: "print-text-napys",
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(1690, "napys", ["unisex"]),
    createdAt: "2026-04-15"
  },
  {
    id: "p-tshirt-cartoon",
    slug: "futbolka-multfilm",
    name: "Футболка «Мультфільм»",
    description: "Футболка з принтом у мотивах улюбленого мультфільму.",
    baseCategory: "t-shirts",
    printId: "print-cartoon",
    basePrice: 950,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(950, "cartoon", ["unisex", "women"]),
    popular: true,
    createdAt: "2026-03-02"
  },
  {
    id: "p-tshirt-movie",
    slug: "futbolka-kino",
    name: "Футболка «Кіно»",
    description: "Футболка з кіно-принтом.",
    baseCategory: "t-shirts",
    printId: "print-movie",
    basePrice: 950,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(950, "movie", ["unisex"]),
    popular: true,
    createdAt: "2026-02-18"
  },
  {
    id: "p-tshirt-basic-black",
    slug: "futbolka-klasychna-chorna",
    name: "Футболка класична чорна",
    description: "Базова футболка без принту, щільність 180 г/м².",
    baseCategory: "basics",
    printId: null,
    basePrice: 690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    variants: makeVariants(690, "basic-black", ["unisex", "women"]),
    popular: true,
    createdAt: "2026-01-10"
  }
];

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

/**
 * Simulates server-side filtering + pagination. In production this becomes a
 * Prisma query against `products`/`variants` with the same filter shape, so
 * that the API contract (and the URL query params) do not need to change.
 */
export function queryProducts(query: CatalogQuery) {
  let results = [...PRODUCTS];

  if (query.baseCategory) {
    results = results.filter((p) => p.baseCategory === query.baseCategory);
  }
  if (query.printCategory) {
    const printIds = PRINTS.filter((pr) => pr.category === query.printCategory).map((pr) => pr.id);
    results = results.filter((p) => p.printId && printIds.includes(p.printId));
  }
  if (query.size) {
    results = results.filter((p) => p.variants.some((v) => v.size === query.size));
  }
  if (query.fit) {
    results = results.filter((p) => p.variants.some((v) => v.fit === query.fit));
  }
  if (query.colorName) {
    results = results.filter((p) => p.variants.some((v) => v.color.name === query.colorName));
  }
  if (typeof query.minPrice === "number") {
    results = results.filter((p) => p.basePrice >= query.minPrice!);
  }
  if (typeof query.maxPrice === "number") {
    results = results.filter((p) => p.basePrice <= query.maxPrice!);
  }

  switch (query.sort) {
    case "new":
      results.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      break;
    case "price-asc":
      results.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      results.sort((a, b) => b.basePrice - a.basePrice);
      break;
    default:
      results.sort((a, b) => Number(b.popular) - Number(a.popular));
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const start = (page - 1) * pageSize;
  const paged = results.slice(start, start + pageSize);

  return { items: paged, total: results.length, page, pageSize };
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getPrint(printId: string | null): Print | undefined {
  if (!printId) return undefined;
  return PRINTS.find((pr) => pr.id === printId);
}

export function getPopularProducts(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.popular).slice(0, limit);
}

export function searchCatalog(q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return { products: [], prints: [], categories: [] };
  const products = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
  );
  const prints = PRINTS.filter((pr) => pr.name.toLowerCase().includes(term));
  const categories = PRINT_CATEGORIES.filter((c) => c.label.toLowerCase().includes(term));
  return { products, prints, categories };
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("uk-UA")} ₴`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `CAS-${n}`;
}
