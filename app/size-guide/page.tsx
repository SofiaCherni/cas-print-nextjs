import SizeChartImage from "@/components/SizeChartImage";
import { SIZE_CHARTS } from "@/lib/size-charts";

export const metadata = {
  title: "Розмірна сітка",
  description: "Розмірна сітка CAS-Print: виміри футболок, світшотів і худі в сантиметрах, щоб обрати свій розмір.",
  alternates: { canonical: "/size-guide" }
};

// Цифри таблиць — у lib/size-charts.ts. Картинки — public/assets/size-guide/<id>.jpg
export default function SizeGuidePage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-4xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">РОЗМІРНА СІТКА</h1>
        <p className="text-muted text-sm mb-14">Орієнтовні виміри виробу в сантиметрах.</p>

        <div className="space-y-20">
          {SIZE_CHARTS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display font-extrabold text-xl md:text-2xl mb-2">{s.title}</h2>
              {s.note && <p className="text-muted text-sm mb-6">{s.note}</p>}
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 items-start">
                <div className="bg-bgSoft aspect-square overflow-hidden">
                  <SizeChartImage id={s.id} alt={s.title} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
                        {s.columns.map((c) => (
                          <th key={c} className="py-3 pr-4">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.rows.map((r) => (
                        <tr key={r[0]} className="border-b border-line">
                          {r.map((cell, i) => (
                            <td key={i} className={`py-3 pr-4 ${i === 0 ? "font-semibold" : "text-muted"}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
