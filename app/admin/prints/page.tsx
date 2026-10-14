import Image from "next/image";
import Link from "next/link";
import { getAllPrintsForAdmin } from "@/lib/data";
import PrintRowActions from "@/components/admin/PrintRowActions";

export const metadata = { title: "Принти — Адмінпанель CAS-Print" };
export const dynamic = "force-dynamic";

export default async function AdminPrintsPage() {
  const prints = await getAllPrintsForAdmin();

  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display font-extrabold text-3xl">ПРИНТИ</h1>
          <Link
            href="/admin/prints/new"
            className="text-sm font-bold border border-paper px-5 py-2.5 hover:bg-paper hover:text-bg transition-colors"
          >
            + ДОДАТИ ПРИНТ
          </Link>
        </div>

        {prints.length === 0 && (
          <p className="text-muted text-sm">
            Принтів ще немає.{" "}
            <Link href="/admin/prints/new" className="underline">
              Додайте перший
            </Link>
            .
          </p>
        )}

        {prints.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
                <th className="py-3 w-16"></th>
                <th className="py-3">Назва</th>
                <th className="py-3">Категорія</th>
                <th className="py-3">На головній</th>
                <th className="py-3">Статус</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {prints.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <td className="py-3">
                    <div className="relative w-12 h-12 bg-bgSoft overflow-hidden">
                      <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                    </div>
                  </td>
                  <td className="py-3.5 font-semibold">{p.name}</td>
                  <td className="py-3.5 text-muted">{p.category ?? "—"}</td>
                  <td className="py-3.5 text-muted">{p.showOnHome ? "Так" : "Ні"}</td>
                  <td className="py-3.5 text-muted">{p.status === "hidden" ? "Приховано" : "Активний"}</td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <PrintRowActions id={p.id} status={p.status} showOnHome={p.showOnHome} />
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
