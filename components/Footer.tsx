import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line py-16 px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h5 className="font-display font-extrabold text-lg mb-2">CAS·PRINT</h5>
            <p className="text-sm opacity-60">Український streetwear-бренд одягу з принтами.</p>
          </div>
          <div>
            <h5 className="text-xs tracking-wide text-muted font-bold mb-4">КАТАЛОГ</h5>
            <ul className="space-y-2.5 text-sm opacity-85">
              <li><Link href="/catalog/t-shirts">Футболки</Link></li>
              <li><Link href="/catalog/sweatshirts">Світшоти</Link></li>
              <li><Link href="/catalog/hoodies">Худі</Link></li>
              <li><Link href="/catalog/basics">Інші товари</Link></li>
              <li><Link href="/custom-print">Створити свій</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wide text-muted font-bold mb-4">ПОКУПЦЯМ</h5>
            <ul className="space-y-2.5 text-sm opacity-85">
              <li><Link href="/delivery-and-payment">Оплата і доставка</Link></li>
              <li><Link href="/returns">Обмін та повернення</Link></li>
              <li><Link href="/size-guide">Розмірна сітка</Link></li>
              <li><Link href="/contacts">Контакти</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-wide text-muted font-bold mb-4">СОЦМЕРЕЖІ</h5>
            <ul className="space-y-2.5 text-sm opacity-85">
              <li>Instagram</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted">
          <span>© 2026 CAS-PRINT</span>
          <span>Політика конфіденційності · Оферта</span>
        </div>
      </div>
    </footer>
  );
}
