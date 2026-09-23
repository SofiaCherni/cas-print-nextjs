import Link from "next/link";
import { getCatalogCounts } from "@/lib/data";

export const metadata = { title: "Адмінпанель — CAS-Print" };
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { products, prints } = await getCatalogCounts();

  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="font-display font-extrabold text-3xl mb-2">АДМІНПАНЕЛЬ</h1>
        <p className="text-muted text-sm mb-12">
          Ця частина сайту захищена паролем адміністратора (див. .env / README, розділ «Адмінка»).
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/products" className="block border border-line p-6 hover:border-paper">
            <h3 className="font-display font-bold text-lg mb-1">Товари</h3>
            <p className="text-muted text-sm">{products} товарів, {prints} принтів</p>
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
