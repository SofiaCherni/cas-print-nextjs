export const metadata = { title: "Розмірна сітка — CAS-Print" };

const ROWS = [
  ["XS", "44", "64"],
  ["S", "46", "66"],
  ["M", "48", "68"],
  ["L", "50", "70"],
  ["XL", "52", "72"],
  ["XXL", "54", "74"],
  ["3XL", "56", "76"],
  ["4XL", "58", "78"],
  ["5XL", "60", "80"]
];

export default function SizeGuidePage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-3">РОЗМІРНА СІТКА</h1>
        <p className="text-muted text-sm mb-10">
          Орієнтовні виміри в см. Точні значення — TODO: NEED REAL BUSINESS DATA.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
              <th className="py-3">Розмір</th>
              <th className="py-3">Ширина, см</th>
              <th className="py-3">Довжина, см</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]} className="border-b border-line">
                <td className="py-3 font-semibold">{r[0]}</td>
                <td className="py-3 text-muted">{r[1]}</td>
                <td className="py-3 text-muted">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
