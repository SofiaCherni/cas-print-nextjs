import Link from "next/link";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import { BASE_CATEGORIES, queryProducts } from "@/lib/data";
import { CatalogQuery } from "@/lib/data";
import { Fit, ProductBaseCategory, PrintCategory, Size } from "@/lib/types";

const SORT_OPTIONS: { value: NonNullable<CatalogQuery["sort"]>; label: string }[] = [
  { value: "popular", label: "ЗА ПОПУЛЯРНІСТЮ" },
  { value: "new", label: "НОВИНКИ" },
  { value: "price-asc", label: "ВІД ДЕШЕВИХ" },
  { value: "price-desc", label: "ВІД ДОРОГИХ" }
];

export default function CatalogView({
  baseCategory,
  searchParams
}: {
  baseCategory?: ProductBaseCategory;
  searchParams: Record<string, string | undefined>;
}) {
  const query: CatalogQuery = {
    baseCategory,
    printCategory: searchParams.printCategory as PrintCategory | undefined,
    size: searchParams.size as Size | undefined,
    fit: searchParams.fit as Fit | undefined,
    colorName: searchParams.color,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: (searchParams.sort as CatalogQuery["sort"]) ?? "popular"
  };

  const { items, total } = queryProducts(query);

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto">
        <div className="py-12 border-b border-line">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-5">
            КАТАЛОГ
          </h1>
          <div className="flex gap-7 text-[13px] font-bold tracking-wide">
            <Link
              href="/catalog"
              className={`pb-2.5 border-b-2 ${
                !baseCategory ? "border-accent text-paper" : "border-transparent text-muted"
              }`}
            >
              ВСІ
            </Link>
            {BASE_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={`/catalog/${c.slug}`}
                className={`pb-2.5 border-b-2 ${
                  baseCategory === c.value ? "border-accent text-paper" : "border-transparent text-muted"
                }`}
              >
                {c.label.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-11 py-11 pb-24">
          <ProductFilters />
          <div>
            <div className="flex justify-between items-center flex-wrap gap-3 mb-7 text-[13px] text-muted">
              <span>{total} товарів</span>
              <div className="flex gap-4">
                {SORT_OPTIONS.map((s) => (
                  <a key={s.value} className="hover:text-paper cursor-pointer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <ProductGrid products={items} />
          </div>
        </div>
      </div>
    </main>
  );
}
