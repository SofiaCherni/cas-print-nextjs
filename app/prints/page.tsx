import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import PrintGrid from "@/components/PrintGrid";
import { getPrintCategories, getPrints } from "@/lib/data";

export const metadata = {
  title: "Принти — CAS-Print",
  description: "Усі готові принти CAS-Print: обери свій і нанеси на футболку чи худі."
};
export const dynamic = "force-dynamic";

export default async function PrintsPage({
  searchParams
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category?.trim() || undefined;
  const [prints, categories] = await Promise.all([
    getPrints(activeCategory),
    getPrintCategories()
  ]);

  const chipBase = "px-5 py-2.5 rounded-full text-sm font-semibold border";
  const chipOn = "border-paper text-paper";
  const chipOff = "border-line text-muted hover:text-paper hover:border-paper";

  return (
    <main className="px-5 md:px-8 py-16 md:py-24">
      <div className="max-w-[1360px] mx-auto">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-10">ПРИНТИ</h1>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-14">
            <Link href="/prints" className={`${chipBase} ${!activeCategory ? chipOn : chipOff}`}>
              Усі
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/prints?category=${encodeURIComponent(c)}`}
                className={`${chipBase} ${
                  activeCategory?.toLowerCase() === c.toLowerCase() ? chipOn : chipOff
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {prints.length === 0 ? (
          <EmptyState
            title="ПРИНТІВ НЕ ЗНАЙДЕНО"
            description="У цій категорії поки немає принтів. Подивись усі принти або весь каталог."
            ctaLabel="УСІ ПРИНТИ"
            ctaHref="/prints"
          />
        ) : (
          <PrintGrid prints={prints} />
        )}
      </div>
    </main>
  );
}
