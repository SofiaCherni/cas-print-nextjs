import { PRODUCTS, formatPrice } from "@/lib/data";

export const metadata = { title: "Товари — Адмінпанель CAS-Print" };

export default function AdminProductsPage() {
  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display font-extrabold text-3xl">ТОВАРИ</h1>
          <button className="text-sm font-bold border border-paper px-5 py-2.5">
            + ДОДАТИ ТОВАР
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
              <th className="py-3">Назва</th>
              <th className="py-3">Категорія</th>
              <th className="py-3">Базова ціна</th>
              <th className="py-3">Варіантів</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.id} className="border-b border-line">
                <td className="py-3.5 font-semibold">{p.name}</td>
                <td className="py-3.5 text-muted">{p.baseCategory}</td>
                <td className="py-3.5 text-muted">{formatPrice(p.basePrice)}</td>
                <td className="py-3.5 text-muted">{p.variants.length}</td>
                <td className="py-3.5 text-right">
                  <button className="text-xs underline text-muted mr-3">Редагувати</button>
                  <button className="text-xs underline text-accent">Приховати</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted mt-8">
          Тут — тільки читання поточних mock-даних. Реальні дії (створення,
          редагування, видалення) вимагають підключеної бази даних і
          <code> /admin/api/products</code> endpoints, описаних у README.
        </p>
      </div>
    </main>
  );
}
