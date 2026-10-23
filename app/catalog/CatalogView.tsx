import Link from "next/link";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import { BASE_CATEGORIES, CatalogQuery, getPrintCategories, queryProducts } from "@/lib/data";
import { CutStyle, Fit, ProductBaseCategory, Size } from "@/lib/types";

const SORT_OPTIONS: { value: NonNullable<CatalogQuery["sort"]>; label: string }[] = [
  { value: "popular", label: "ЗА ПОПУЛЯРНІСТЮ" },
  { value: "new", label: "НОВИНКИ" },
  { value: "price-asc", label: "ВІД ДЕШЕВИХ" },
  { value: "price-desc", label: "ВІД ДОРОГИХ" }
];

export default async function CatalogView({
  baseCategory,
  searchParams
}: {
  baseCategory?: ProductBaseCategory;
  searchParams: Record<string, string | undefined>;
}) {
  const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);
  const sort = SORT_VALUES.includes(searchParams.sort as NonNullable<CatalogQuery["sort"]>)
    ? (searchParams.sort as NonNullable<CatalogQuery["sort"]>)
    : "popular";
  const basePath = baseCategory ? `/catalog/${baseCategory}` : "/catalog";

  // Посилання сортування зберігає всі інші фільтри з адреси.
  const sortHref = (value: string) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "sort" && k !== "page") params.set(k, v);
    }
    params.set("sort", value);
    return `${basePath}?${params.toString()}`;
  };

  const query: CatalogQuery = {
    baseCategory,
    cutStyle: searchParams.cut as CutStyle | undefined,
    productType: searchParams.type,
    printCategory: searchParams.printCategory,
    size: searchParams.size as Size | undefined,
    fit: searchParams.fit as Fit | undefined,
    colorName: searchParams.color,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort
  };

  const [{ items, total }, printCategories] = await Promise.all([
    queryProducts(query),
    getPrintCategories()
  ]);

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
          <ProductFilters printCategories={printCategories} />
          <div>
            <div className="flex justify-between items-center flex-wrap gap-3 mb-7 text-[13px] text-muted">
              <span>{total} товарів</span>
              <div className="flex gap-4">
                {SORT_OPTIONS.map((s) => (
                  <Link
                    key={s.value}
                    href={sortHref(s.value)}
                    className={`hover:text-paper ${sort === s.value ? "text-paper" : ""}`}
                  >
                    {s.label}
                  </Link>
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
