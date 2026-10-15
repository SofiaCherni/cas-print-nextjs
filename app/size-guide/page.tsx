export const metadata = { title: "Розмірна сітка — CAS-Print" };

/**
 * Три розмірні сітки. Усе, що треба змінити, лежить у масиві SECTIONS нижче:
 *  - image: шлях до зображення (поклади файл у public/assets/size-guide/ і впиши шлях);
 *  - columns: заголовки колонок таблиці;
 *  - rows: рядки таблиці.
 * Усі значення зараз — тимчасові, для заповнення.
 */
const SECTIONS: {
  id: string;
  title: string;
  image: string;
  columns: string[];
  rows: string[][];
}[] = [
  {
    id: "tshirt-classic",
    title: "ФУТБОЛКИ КЛАСИЧНІ",
    image: "/assets/size-guide/tshirt-classic.svg",
    columns: ["Розмір", "Ширина, см", "Довжина, см"],
    rows: [
      ["XS", "44", "64"],
      ["S", "46", "66"],
      ["M", "48", "68"],
      ["L", "50", "70"],
      ["XL", "52", "72"],
      ["XXL", "54", "74"],
      ["3XL", "56", "76"],
      ["4XL", "58", "78"],
      ["5XL", "60", "80"]
    ]
  },
  {
    id: "tshirt-oversize",
    title: "ФУТБОЛКИ ОВЕРСАЙЗ",
    image: "/assets/size-guide/tshirt-oversize.svg",
    columns: ["Розмір", "Ширина, см", "Довжина, см", "Рукав, см"],
    rows: [["OVERSIZE", "58", "74", "28"]]
  },
  {
    id: "hoodies",
    title: "ХУДІ ТА СВІТШОТИ",
    image: "/assets/size-guide/hoodies.svg",
    columns: ["Розмір", "Ширина, см", "Довжина, см", "Рукав, см"],
    rows: [
      ["S", "54", "66", "60"],
      ["M", "56", "68", "62"],
      ["L", "58", "70", "64"],
      ["XL", "60", "72", "66"],
      ["XXL", "62", "74", "68"]
    ]
  }
];

export default function SizeGuidePage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-4xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">РОЗМІРНА СІТКА</h1>
        <p className="text-muted text-sm mb-14">Орієнтовні виміри виробу в сантиметрах.</p>

        <div className="space-y-20">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-display font-extrabold text-xl md:text-2xl mb-6">{s.title}</h2>
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8 items-start">
                <div className="bg-bgSoft aspect-square overflow-hidden">
                  {/* Звичайний <img>, щоб працювали і .svg, і .jpg/.png без налаштувань next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.title} className="w-full h-full object-contain" />
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
