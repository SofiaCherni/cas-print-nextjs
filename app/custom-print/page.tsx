"use client";

import { useState } from "react";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import { trackLead } from "@/lib/analytics";
import Button from "@/components/Button";
import { FABRICS, FABRIC_ORDER, FabricKey, colorsByName, fabricTitle, getTemplate } from "@/lib/product-templates";
import { Fit } from "@/lib/types";

// Річ → шаблон з lib/product-templates.ts: звідти беруться розміри, фасони, кольори й тканини.
const GARMENTS = [
  { value: "t-shirt", label: "Футболка", templateKey: "tshirt-classic" },
  { value: "sweatshirt", label: "Світшот", templateKey: "sweatshirt" },
  { value: "hoodie", label: "Худі", templateKey: "hoodie" }
];
const FIT_LABEL: Record<Fit, string> = { unisex: "УНІСЕКС", women: "ЖІНОЧА" };

function Step({ n, title, children, last }: { n: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line ${last ? "border-b" : ""}`}>
      <span className="font-display font-extrabold text-lg text-accent">{n}</span>
      <div>
        <h4 className="font-display font-bold text-base mb-2.5">{title}</h4>
        {children}
      </div>
    </div>
  );
}

export default function CustomPrintPage() {
  const [garment, setGarment] = useState(GARMENTS[0].value);
  const [pickedFabric, setFabric] = useState<FabricKey>("standard");
  const [pickedFit, setFit] = useState<Fit>("unisex");
  const [pickedSize, setSize] = useState<string>("M");
  const [pickedColor, setColor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Усе нижче залежить від речі → тканини → фасону: розміри й кольори підтягуються самі.
  const garmentDef = GARMENTS.find((g) => g.value === garment) ?? GARMENTS[0];
  const template = getTemplate(garmentDef.templateKey)!;
  const fabricKeys = FABRIC_ORDER.filter((k) => template.fabrics?.includes(k));
  const fabric: FabricKey | null = fabricKeys.length > 0 ? (fabricKeys.includes(pickedFabric) ? pickedFabric : fabricKeys[0]) : null;
  const sizesByFit = (fabric ? FABRICS[fabric].sizesByFit : template.sizesByFit) as Partial<Record<Fit, string[]>>;
  const fits = Object.keys(sizesByFit) as Fit[];
  const fit: Fit = fits.includes(pickedFit) ? pickedFit : fits[0];
  const sizes = sizesByFit[fit] ?? [];
  const size = sizes.includes(pickedSize) ? pickedSize : sizes.includes("M") ? "M" : sizes[0] ?? "";
  const colors = colorsByName(fabric ? FABRICS[fabric].colors : template.colors);
  const color = colors.some((c) => c.name === pickedColor) ? pickedColor : colors[0]?.name ?? "";

  let stepNo = 0;
  const num = () => String(++stepNo).padStart(2, "0");

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
    if (!consent) {
      setError("Потрібна згода на обробку персональних даних.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("productId", garment);
    fd.append("size", size);
    if (fits.length > 1) fd.append("fit", FIT_LABEL[fit]);
    if (fabric) fd.append("fabric", fabricTitle(FABRICS[fabric]));
    fd.append("colorName", color);
    fd.append("text", text);
    fd.append("comment", comment);
    fd.append("customerName", name);
    fd.append("customerPhone", phone);
    fd.append("customerEmail", email);
    fd.append("consent", "true");
    try {
      const res = await fetch("/api/custom-print-requests", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Не вдалося надіслати заявку.");
        return;
      }
      trackLead();
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
          <Step n={num()} title="ОБЕРИ РІЧ">
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
          </Step>

          {fabric && (
            <Step n={num()} title="ОБЕРИ ТКАНИНУ">
              <div className="flex flex-wrap gap-2.5">
                {fabricKeys.map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setFabric(k)}
                    className={`px-4 py-2.5 border text-xs font-bold tracking-wide ${
                      fabric === k ? "bg-paper text-bg border-paper" : "border-line"
                    }`}
                  >
                    {fabricTitle(FABRICS[k])}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2.5">{FABRICS[fabric].hint}</p>
            </Step>
          )}

          {fits.length > 1 && (
            <Step n={num()} title="ОБЕРИ ФАСОН">
              <div className="flex gap-2.5">
                {fits.map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFit(f)}
                    className={`px-4 py-2.5 border text-xs font-bold tracking-wide ${
                      fit === f ? "bg-paper text-bg border-paper" : "border-line"
                    }`}
                  >
                    {FIT_LABEL[f]}
                  </button>
                ))}
              </div>
            </Step>
          )}

          <Step n={num()} title={template.sizeLabel === "ДОВЖИНА" ? "ОБЕРИ ДОВЖИНУ" : "ОБЕРИ РОЗМІР"}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => setSize(sz)}
                  className={`min-w-[44px] px-3 h-10 flex items-center justify-center text-xs font-bold border ${
                    size === sz ? "bg-paper text-bg border-paper" : "border-line"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </Step>

          <Step n={num()} title={`ОБЕРИ КОЛІР — ${color}`}>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  title={c.name}
                  onClick={() => setColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-[26px] h-[26px] rounded-full border ${
                    color === c.name ? "border-paper ring-1 ring-paper" : "border-paper/25"
                  }`}
                />
              ))}
            </div>
          </Step>

          <div className="grid grid-cols-[50px_1fr] gap-5 py-6 border-t border-line">
            <span className="font-display font-extrabold text-lg text-accent">{num()}</span>
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
            <span className="font-display font-extrabold text-lg text-accent">{num()}</span>
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
            <span className="font-display font-extrabold text-lg text-accent">{num()}</span>
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
            <span className="font-display font-extrabold text-lg text-accent">{num()}</span>
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

          <ConsentCheckbox
            checked={consent}
            onChange={setConsent}
            purpose="опрацювання заявки та звʼязку зі мною"
          />
          {error && <p className="text-xs text-accent mt-4">{error}</p>}
          <Button type="submit" variant="accent" className="w-full py-[18px] mt-8" disabled={submitting}>
            {submitting ? "НАДСИЛАННЯ…" : "ВІДПРАВИТИ ЗАЯВКУ"}
          </Button>
        </form>
      </div>
    </main>
  );
}
