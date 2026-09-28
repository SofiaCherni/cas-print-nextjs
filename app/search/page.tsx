import Link from "next/link";
import { searchCatalog } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  return { title: q ? `Пошук: ${q} — CAS-Print` : "Пошук — CAS-Print" };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const { products, prints, categories } = await searchCatalog(q);

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto py-14 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
          РЕЗУЛЬТАТИ ПОШУКУ
        </h1>
        <p className="text-muted text-sm mb-10">
          {q ? (
            <>За запитом «{q}» знайдено {products.length} товарів.</>
          ) : (
            "Введіть запит у пошуку."
          )}
        </p>

        {(prints.length > 0 || categories.length > 0) && (
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.map((c) => (
              <Link
                key={c.value}
                href={`/catalog?printCategory=${c.value}`}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-line text-muted hover:text-paper hover:border-paper"
              >
                Категорія: {c.label}
              </Link>
            ))}
            {prints.map((p) => (
              <Link
                key={p.id}
                href={`/catalog?printCategory=${p.category}`}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-line text-muted hover:text-paper hover:border-paper"
              >
                Принт: {p.name}
              </Link>
            ))}
          </div>
        )}

        <ProductGrid products={products} />
      </div>
    </main>
  );
}
