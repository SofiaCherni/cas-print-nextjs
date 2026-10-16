export const metadata = {
  title: "Обмін та повернення",
  description: "Умови обміну та повернення товару CAS-Print: 14 днів з дня покупки для товарів належної якості.",
  alternates: { canonical: "/returns" }
};

const STEPS = [
  {
    title: "Законодавство",
    body: "Повернення товару проводиться згідно з чинним законодавством України."
  },
  {
    title: "Стан товару",
    body: "Товар не повинен мати слідів використання, пошкоджень або втрати товарного вигляду."
  },
  {
    title: "Повернення коштів",
    body: "Після отримання товару інтернет-магазин повертає сплачену суму за вирахуванням витрат, повʼязаних з доставкою товару покупцеві."
  }
];

export default function ReturnsPage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-10">ОБМІН ТА ПОВЕРНЕННЯ</h1>

        <h2 className="font-display font-bold text-lg mb-3">ПОРЯДОК ПОВЕРНЕННЯ</h2>
        <p className="text-muted text-sm leading-relaxed mb-12">
          Повернути товар в магазин або обміняти його на інший можна протягом 14 днів з дня покупки.
          Це стосується товарів належної якості, тобто невикористаних і неушкоджених.
        </p>

        {STEPS.map((s, i) => (
          <div key={s.title} className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line last:border-b">
            <span className="font-display font-extrabold text-lg text-accent">{i + 1}</span>
            <div>
              <h3 className="font-display font-bold text-base mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}

        <div className="mt-12">
          <h2 className="font-display font-bold text-lg mb-2.5">РОЗМІРИ 3XL–5XL</h2>
          <p className="text-muted text-sm leading-relaxed">
            Обмін та повернення для розмірів 3XL–5XL недоступні.
          </p>
        </div>
      </div>
    </main>
  );
}
