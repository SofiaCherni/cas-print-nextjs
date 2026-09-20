export const metadata = { title: "Доставка та оплата — CAS-Print" };

export default function DeliveryAndPaymentPage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-14">ДОСТАВКА ТА ОПЛАТА</h1>

        <div id="delivery" className="py-7 border-t border-line scroll-mt-24">
          <h2 className="font-display font-bold text-lg mb-3">ДОСТАВКА</h2>
          <ul className="text-muted text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>Доставка тільки через Нову Пошту.</li>
            <li>Термін доставки — 3–5 робочих днів.</li>
            <li>Вартість доставки — за тарифами перевізника.</li>
          </ul>
        </div>

        <div id="payment" className="py-7 border-t border-line last:border-b scroll-mt-24">
          <h2 className="font-display font-bold text-lg mb-3">ОПЛАТА</h2>
          <ul className="text-muted text-sm leading-relaxed space-y-2 list-disc pl-5">
            <li>Повна оплата онлайн.</li>
            <li>Оплата при отриманні (50% передплата).</li>
            <li>Готівка або безготівковий розрахунок.</li>
          </ul>
          <p className="text-muted text-xs leading-relaxed mt-4">
            Спосіб оплати узгоджується з менеджером після оформлення
            замовлення — у Viber, Telegram або WhatsApp, який ви вкажете
            при замовленні.
          </p>
        </div>
      </div>
    </main>
  );
}
