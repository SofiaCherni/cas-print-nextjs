import Link from "next/link";
import { PRODUCTS, PRINTS } from "@/lib/data";

export const metadata = { title: "Адмінпанель — CAS-Print" };

export default function AdminHome() {
  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="font-display font-extrabold text-3xl mb-2">АДМІНПАНЕЛЬ</h1>
        <p className="text-muted text-sm mb-12">
          Демонстраційний UI. У production дані та дії тут йдуть через <code>/admin/api/*</code>,
          захищені автентифікацією та ролями доступу (розділ «Безпека» у README).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/products" className="block border border-line p-6 hover:border-paper">
            <h3 className="font-display font-bold text-lg mb-1">Товари</h3>
            <p className="text-muted text-sm">{PRODUCTS.length} товарів, {PRINTS.length} принтів</p>
          </Link>
          <Link href="/admin/orders" className="block border border-line p-6 hover:border-paper">
            <h3 className="font-display font-bold text-lg mb-1">Замовлення</h3>
            <p className="text-muted text-sm">Перегляд і зміна статусу замовлень</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
