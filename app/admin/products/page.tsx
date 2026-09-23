import Link from "next/link";
import { getAllProductsForAdmin, formatPrice, BASE_CATEGORIES } from "@/lib/data";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const metadata = { title: "Товари — Адмінпанель CAS-Print" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();
  const categoryLabel = (value: string) =>
    BASE_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display font-extrabold text-3xl">ТОВАРИ</h1>
          <Link
            href="/admin/products/new"
            className="text-sm font-bold border border-paper px-5 py-2.5 hover:bg-paper hover:text-bg transition-colors"
          >
            + ДОДАТИ ТОВАР
          </Link>
        </div>

        {products.length === 0 && (
          <p className="text-muted text-sm">
            Товарів ще немає.{" "}
            <Link href="/admin/products/new" className="underline">
              Додайте перший
            </Link>
            .
          </p>
        )}

        {products.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
                <th className="py-3">Назва</th>
                <th className="py-3">Категорія</th>
                <th className="py-3">Ціна</th>
                <th className="py-3">Варіантів</th>
                <th className="py-3">Статус</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <td className="py-3.5 font-semibold">{p.name}</td>
                  <td className="py-3.5 text-muted">{categoryLabel(p.baseCategory)}</td>
                  <td className="py-3.5 text-muted">
                    {formatPrice(p.basePrice)}
                    {p.onSale && p.salePrice ? ` → ${formatPrice(p.salePrice)}` : ""}
                  </td>
                  <td className="py-3.5 text-muted">{p.variants.length}</td>
                  <td className="py-3.5 text-muted">
                    {p.status === "hidden" ? "Приховано" : "Активний"}
                  </td>
                  <td className="py-3.5 text-right">
                    <ProductRowActions id={p.id} status={p.status ?? "active"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
