"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";

type ContactMethod = "viber" | "telegram" | "whatsapp";

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: "viber", label: "Viber" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" }
];

export default function CheckoutPage() {
  const { lines, subtotal, items, clear, phone: cartPhone, comment } = useCart();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState(cartPhone);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("viber");
  const [city, setCity] = useState("");
  const [postomatNumber, setPostomatNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartPhone) setPhone(cartPhone);
  }, [cartPhone]);

  // Delivery cost is not invented here per brief section 27 — real cost is
  // "за тарифами перевізника" (Nova Poshta), confirmed with the customer
  // after the order is placed.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          contact: { lastName, firstName, patronymic, phone, contactMethod },
          delivery: { city, postomatNumber },
          comment
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося оформити замовлення.");
        return;
      }
      setOrderNumber(data.orderNumber);
      clear();
    } catch {
      setError("Не вдалося звʼязатися з сервером. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    const methodLabel = CONTACT_METHODS.find((m) => m.value === contactMethod)?.label;
    return (
      <main className="px-5 md:px-8 py-24">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-display font-extrabold text-3xl mb-4">
            Замовлення №{orderNumber} прийнято
          </h1>
          <p className="text-muted text-sm mb-8">
            Ми звʼяжемось із вами через {methodLabel} на номер {phone} для підтвердження
            деталей і оплати.
          </p>
          <Button href="/catalog" variant="ghost">ПЕРЕГЛЯНУТИ КАТАЛОГ</Button>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="px-5 md:px-8 py-14">
        <EmptyState
          title="КОШИК ПОРОЖНІЙ"
          description="Додайте товар, щоб оформити замовлення."
          ctaLabel="ПЕРЕГЛЯНУТИ КАТАЛОГ"
          ctaHref="/catalog"
        />
      </main>
    );
  }

  return (
    <main className="px-5 md:px-8 py-14">
      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto grid md:grid-cols-[1.3fr_0.9fr] gap-16">
        <div>
          <div className="mb-11">
            <div className="flex items-center gap-2.5 font-display font-extrabold text-base mb-5">
              <span className="w-[26px] h-[26px] rounded-full bg-accent flex items-center justify-center text-xs">1</span>
              ОСОБИСТІ ДАНІ
            </div>
            <div className="grid grid-cols-3 gap-3.5">
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
                placeholder="Прізвище" className="bg-bgSoft border border-line px-4 py-3.5 text-sm" />
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ім'я" className="bg-bgSoft border border-line px-4 py-3.5 text-sm" />
              <input required value={patronymic} onChange={(e) => setPatronymic(e.target.value)}
                placeholder="По батькові" className="bg-bgSoft border border-line px-4 py-3.5 text-sm" />
            </div>
          </div>

          <div className="mb-11">
            <div className="flex items-center gap-2.5 font-display font-extrabold text-base mb-5">
              <span className="w-[26px] h-[26px] rounded-full bg-accent flex items-center justify-center text-xs">2</span>
              ЯК ЗВʼЯЗАТИСЯ
            </div>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефону" className="bg-bgSoft border border-line px-4 py-3.5 text-sm w-full mb-3.5" />
            <div className="flex gap-2.5">
              {CONTACT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setContactMethod(m.value)}
                  className={`px-5 py-3 border text-sm font-semibold flex-1 ${
                    contactMethod === m.value ? "bg-paper text-bg border-paper" : "border-line text-paper"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2.5">
              Оберіть месенджер, у якому нам буде зручно з вами зв'язатися.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2.5 font-display font-extrabold text-base mb-5">
              <span className="w-[26px] h-[26px] rounded-full bg-accent flex items-center justify-center text-xs">3</span>
              ДОСТАВКА
            </div>
            <div className="flex items-center gap-3 p-4 border border-accent mb-3.5 text-sm font-semibold w-fit">
              Нова Пошта — у поштомат
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <input required value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Місто" className="bg-bgSoft border border-line px-4 py-3.5 text-sm" />
              <input required value={postomatNumber} onChange={(e) => setPostomatNumber(e.target.value)}
                placeholder="Номер поштомата" className="bg-bgSoft border border-line px-4 py-3.5 text-sm" />
            </div>
            <p className="text-xs text-muted mt-2.5">
              Доставка тільки через Нову Пошту, 3–5 робочих днів. Вартість — за тарифами перевізника.
            </p>
          </div>
        </div>

        <div className="bg-bgSoft border border-line p-7 h-fit sticky top-24">
          <h4 className="font-display font-extrabold mb-5">ВАШЕ ЗАМОВЛЕННЯ</h4>
          <div className="flex justify-between text-sm text-muted mb-3">
            <span>Товари</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted mb-3">
            <span>Доставка</span>
            <span>за тарифами Нової Пошти</span>
          </div>
          <div className="flex justify-between font-display font-extrabold text-base pt-3.5 border-t border-line">
            <span>РАЗОМ</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {comment && (
            <div className="mt-4 pt-4 border-t border-line">
              <p className="text-xs text-muted font-bold mb-1.5">КОМЕНТАР</p>
              <p className="text-xs text-muted leading-relaxed">{comment}</p>
            </div>
          )}
          <p className="text-xs text-muted mt-4">
            Оплату узгодимо з вами в обраному месенджері після підтвердження
            замовлення — онлайн-оплата на сайті поки не підключена.
          </p>
          {error && <p className="text-xs text-accent mt-4">{error}</p>}
          <Button type="submit" variant="accent" className="w-full py-[18px] mt-5" disabled={submitting}>
            {submitting ? "ОБРОБКА…" : "ЗАМОВИТИ"}
          </Button>
        </div>
      </form>
    </main>
  );
}
