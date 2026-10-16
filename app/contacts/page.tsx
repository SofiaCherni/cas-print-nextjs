import { SOCIALS } from "@/lib/site-config";

export const metadata = {
  title: "Контакти",
  description: "Звʼяжіться з CAS-Print: Instagram, Telegram та інші контакти магазину.",
  alternates: { canonical: "/contacts" }
};

// TODO: NEED REAL BUSINESS DATA — телефон і email.
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
          <ul className="text-sm leading-relaxed space-y-2">
            {Object.values(SOCIALS).map((so) => (
              <li key={so.label}>
                <a href={so.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  {so.label} — <span className="text-muted">{so.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
