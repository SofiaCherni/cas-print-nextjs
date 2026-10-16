export const metadata = {
  title: "Оплата і доставка",
  description: "Умови оплати та доставки CAS-Print: Нова Пошта, 3–5 робочих днів, оплата онлайн або при отриманні.",
  alternates: { canonical: "/delivery-and-payment" }
};

export default function DeliveryAndPaymentPage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-14">ОПЛАТА І ДОСТАВКА</h1>

        <div id="payment" className="py-7 border-t border-line scroll-mt-24">
          <h2 className="font-display font-bold text-lg mb-3">ОПЛАТА</h2>
          <ul className="text-muted text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>Повна оплата онлайн,</li>
            <li>оплата при отриманні (50% передплата),</li>
            <li>готівка або безготівковий розрахунок.</li>
          </ul>
        </div>

        <div id="delivery" className="py-7 border-t border-line last:border-b scroll-mt-24">
          <h2 className="font-display font-bold text-lg mb-3">ДОСТАВКА</h2>
          <ul className="text-muted text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>Доставка тільки через Нову Пошту.</li>
            <li>Термін доставки 3–5 робочих днів.</li>
            <li>Вартість доставки за тарифами перевізника.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
