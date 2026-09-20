export const metadata = { title: "Контакти — CAS-Print" };

// TODO: NEED REAL BUSINESS DATA — replace with real phone/email/social links.
export default function ContactsPage() {
  return (
    <main className="px-5 md:px-8">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl mb-14">КОНТАКТИ</h1>

        <div className="py-7 border-t border-line">
          <h2 className="font-display font-bold text-lg mb-3">ЗВʼЯЗАТИСЯ З НАМИ</h2>
          <p className="text-muted text-sm leading-relaxed">
            Телефон, email — TODO: NEED REAL BUSINESS DATA.
          </p>
        </div>

        <div className="py-7 border-t border-line last:border-b">
          <h2 className="font-display font-bold text-lg mb-3">СОЦМЕРЕЖІ</h2>
          <p className="text-muted text-sm leading-relaxed">
            Instagram, TikTok — TODO: NEED REAL BUSINESS DATA (посилання на реальні акаунти).
          </p>
        </div>
      </div>
    </main>
  );
}
