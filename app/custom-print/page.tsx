"use client";

import { useState } from "react";
import Button from "@/components/Button";

const GARMENTS = [
  { value: "t-shirt", label: "Футболка" },
  { value: "hoodie", label: "Худі" }
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const COLORS = ["Чорний", "Молочний", "Сірий", "Теракотовий", "Хакі"];

export default function CustomPrintPage() {
  const [garment, setGarment] = useState(GARMENTS[0].value);
  const [size, setSize] = useState<string>("M");
  const [color, setColor] = useState(COLORS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Додайте зображення, напис або логотип.");
      return;
    }
    if (!name || !phone || !email) {
      setError("Заповніть контактні дані, щоб ми могли з вами зв'язатися.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("productId", garment);
    fd.append("size", size);
    fd.append("colorName", color);
    fd.append("text", text);
    fd.append("comment", comment);
    fd.append("customerName", name);
    fd.append("customerPhone", phone);
    fd.append("customerEmail", email);
    try {
      const res = await fetch("/api/custom-print-requests", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Не вдалося надіслати заявку.");
        return;
      }
      setDone(true);
    } catch {
      setError("Не вдалося звʼязатися з сервером.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="px-5 md:px-8 py-24 text-center">
        <h1 className="font-display font-extrabold text-3xl mb-4">Заявку надіслано</h1>
        <p className="text-muted text-sm mb-8">
          Ми звʼяжемось з вами на {phone}, щойно опрацюємо макет.
        </p>
        <Button href="/catalog" variant="ghost">ПЕРЕГЛЯНУТИ КАТАЛОГ</Button>
      </main>
    );
  }

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-center mb-3">
          СТВОРИТИ СВІЙ ПРИНТ
        </h1>
        <p className="text-center text-muted text-sm max-w-sm mx-auto mb-14">
          Завантаж своє фото, напис чи логотип — ми нанесемо його на обрану річ.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">01</span>
            <div>
              <h4 className="font-display font-bold text-base mb-2.5">ОБЕРИ РІЧ</h4>
              <div className="flex gap-2.5">
                {GARMENTS.map((g) => (
                  <button
                    type="button"
                    key={g.value}
                    onClick={() => setGarment(g.value)}
                    className={`px-4 py-2.5 border text-sm font-semibold ${
                      garment === g.value ? "bg-paper text-bg border-paper" : "border-line"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">02</span>
            <div>
              <h4 className="font-display font-bold text-base mb-2.5">ОБЕРИ РОЗМІР</h4>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-11 h-10 flex items-center justify-center text-xs font-bold border ${
                      size === s ? "bg-paper text-bg border-paper" : "border-line"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">03</span>
            <div>
              <h4 className="font-display font-bold text-base mb-2.5">ОБЕРИ КОЛІР</h4>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-3.5 py-2 border text-xs font-semibold ${
                      color === c ? "bg-paper text-bg border-paper" : "border-line"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">04</span>
            <div>
              <h4 className="font-display font-bold text-base mb-1.5">ЗАВАНТАЖ ЗОБРАЖЕННЯ</h4>
              <p className="text-muted text-[13px] mb-3">PNG, JPG, WEBP або PDF, до 15 МБ.</p>
              <label className="block border border-dashed border-line p-7 text-center text-xs text-muted cursor-pointer">
                {file ? file.name : "Перетягни файл сюди або натисни для завантаження"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">05</span>
            <div>
              <h4 className="font-display font-bold text-base mb-1.5">ДОДАЙ ТЕКСТ (ЗА БАЖАННЯМ)</h4>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напис для нанесення"
                className="w-full bg-bgSoft border border-line px-4 py-3 text-sm mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">06</span>
            <div>
              <h4 className="font-display font-bold text-base mb-1.5">КОМЕНТАР ДО ЗАМОВЛЕННЯ</h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Уточнення щодо розміщення принта, розміру нанесення тощо"
                rows={3}
                className="w-full bg-bgSoft border border-line px-4 py-3 text-sm mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line border-b">
            <span className="font-display font-extrabold text-lg text-accent">07</span>
            <div>
              <h4 className="font-display font-bold text-base mb-2.5">КОНТАКТНІ ДАНІ</h4>
              <div className="space-y-2.5">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я"
                  className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон"
                  className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
                  className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-accent mt-4">{error}</p>}
          <Button type="submit" variant="accent" className="w-full py-[18px] mt-8" disabled={submitting}>
            {submitting ? "НАДСИЛАННЯ…" : "ВІДПРАВИТИ ЗАЯВКУ"}
          </Button>
        </form>
      </div>
    </main>
  );
}
