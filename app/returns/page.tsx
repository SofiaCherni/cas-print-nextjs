export const metadata = { title: "Обмін та повернення — CAS-Print" };

const SECTIONS = [
  { title: "СТАНДАРТНІ ТОВАРИ", body: "Умови обміну та повернення для стандартних товарів без індивідуального принта — TODO: NEED REAL BUSINESS DATA." },
  { title: "ТОВАРИ З ІНДИВІДУАЛЬНИМ ПРИНТОМ", body: "Товари, виготовлені за індивідуальним замовленням, мають окремі умови — TODO: NEED REAL BUSINESS DATA." },
  { title: "РОЗМІРИ 3XL–5XL", body: "Обмін та повернення для розмірів 3XL–5XL недоступні." }
];

export default function ReturnsPage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-14">ОБМІН ТА ПОВЕРНЕННЯ</h1>
        {SECTIONS.map((s) => (
          <div key={s.title} className="py-7 border-t border-line last:border-b">
            <h2 className="font-display font-bold text-lg mb-2.5">{s.title}</h2>
            <p className="text-muted text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
