"use client";

import { useEffect, useState } from "react";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import Button from "@/components/Button";
import GarmentMockup, { PrintFormat, Side } from "@/components/custom-print/GarmentMockup";
import { trackLead } from "@/lib/analytics";
import { PRINT_FORMATS, PRINT_PRICE } from "@/lib/custom-print";
import { FABRICS, FABRIC_ORDER, FabricKey, colorsByName, fabricTitle, getTemplate } from "@/lib/product-templates";
import { Fit } from "@/lib/types";

type Garment = "t-shirt" | "sweatshirt" | "hoodie";

// Річ → шаблон з lib/product-templates.ts: звідти беруться розміри, фасони, кольори й тканини.
const GARMENTS: { value: Garment; label: string; templateKey: string }[] = [
  { value: "t-shirt", label: "Футболка", templateKey: "tshirt-classic" },
  { value: "sweatshirt", label: "Світшот", templateKey: "sweatshirt" },
  { value: "hoodie", label: "Худі", templateKey: "hoodie" }
];
const FIT_LABEL: Record<Fit, string> = { unisex: "Унісекс", women: "Жіночий" };
const SIDE_LABEL: Record<Side, string> = { front: "Перед", back: "Спина" };
const SIDE_WHERE: Record<Side, string> = { front: "спереду", back: "ззаду" };

interface SideState {
  printed: boolean;
  format: PrintFormat;
  kind: "image" | "text";
  file: File | null;
  previewUrl: string | null;
  text: string;
  offset: { x: number; y: number };
}
const newSide = (printed: boolean): SideState => ({
  printed, format: "A4", kind: "image", file: null, previewUrl: null, text: "", offset: { x: 0, y: 0 }
});

const pill = (active: boolean) =>
  `border text-sm font-semibold transition-colors ${active ? "bg-paper text-bg border-paper" : "border-line bg-bgSoft"}`;

function Section({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="py-5 border-t border-line first:border-t-0">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display font-bold text-base">{title}</h3>
        {aside && <span className="text-xs text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

export default function CustomPrintPage() {
  const [garment, setGarment] = useState<Garment>("t-shirt");
  const [pickedFabric, setFabric] = useState<FabricKey>("standard");
  const [pickedFit, setFit] = useState<Fit>("unisex");
  const [pickedSize, setSize] = useState("M");
  const [pickedColor, setColor] = useState("Чорний");
  const [side, setSide] = useState<Side>("front");
  const [sides, setSides] = useState<Record<Side, SideState>>({ front: newSide(true), back: newSide(false) });
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const garmentDef = GARMENTS.find((g) => g.value === garment)!;
  const template = getTemplate(garmentDef.templateKey)!;
  const fabricKeys = FABRIC_ORDER.filter((k) => template.fabrics?.includes(k));
  const fabric: FabricKey | null = fabricKeys.length ? (fabricKeys.includes(pickedFabric) ? pickedFabric : fabricKeys[0]) : null;
  const sizesByFit = (fabric ? FABRICS[fabric].sizesByFit : template.sizesByFit) as Partial<Record<Fit, string[]>>;
  const fits = Object.keys(sizesByFit) as Fit[];
  const fit: Fit = fits.includes(pickedFit) ? pickedFit : fits[0];
  const sizes = sizesByFit[fit] ?? [];
  const size = sizes.includes(pickedSize) ? pickedSize : sizes.includes("M") ? "M" : sizes[0] ?? "";
  const colors = colorsByName(fabric ? FABRICS[fabric].colors : template.colors);
  const colorObj = colors.find((c) => c.name === pickedColor) ?? colors[0];
  const color = colorObj?.name ?? "";

  const basePrice = fabric ? FABRICS[fabric].defaultPrice : template.defaultPrice ?? 0;
  const fromPrice = (k: FabricKey) => FABRICS[k].defaultPrice + PRINT_PRICE.A6;
  const sideHasContent = (s: SideState) => s.printed && (s.kind === "image" ? !!s.file : !!s.text.trim());
  const printTotal = (["front", "back"] as Side[]).reduce((sum, k) => (sides[k].printed ? sum + PRINT_PRICE[sides[k].format] : sum), 0);
  const unitPrice = basePrice + printTotal;
  const total = unitPrice * quantity;

  const cur = sides[side];
  const patch = (s: Side, p: Partial<SideState>) => setSides((prev) => ({ ...prev, [s]: { ...prev[s], ...p } }));

  // Прибираємо object URL, щоб не накопичувати пам'ять.
  useEffect(() => () => {
    (["front", "back"] as Side[]).forEach((k) => sides[k].previewUrl && URL.revokeObjectURL(sides[k].previewUrl!));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickFile(f: File | null) {
    if (cur.previewUrl) URL.revokeObjectURL(cur.previewUrl);
    const url = f && f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    patch(side, { file: f, previewUrl: url, offset: { x: 0, y: 0 } });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = (["front", "back"] as Side[]).filter((k) => sideHasContent(sides[k]));
    if (filled.length === 0) {
      setError("Додайте картинку або напис хоча б на одну сторону.");
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

    const spec = filled.map((k) => {
      const s = sides[k];
      const pos = `зсув ${Math.round(s.offset.x)}/${Math.round(s.offset.y)}`;
      return `${SIDE_LABEL[k]}: ${s.format}${s.kind === "text" ? `, напис «${s.text.trim()}»` : ", картинка"}, ${pos}`;
    });
    const fullComment = [`Кількість: ${quantity}. Орієнтовна сума: ₴${total}.`, ...spec, comment].filter(Boolean).join("\n");

    const fd = new FormData();
    const front = sides.front;
    const back = sides.back;
    if (sideHasContent(front) && front.kind === "image" && front.file) fd.append("file", front.file);
    if (sideHasContent(back) && back.kind === "image" && back.file) {
      // Якщо передній файл не додано — спина стає основним файлом.
      fd.append(fd.has("file") ? "fileBack" : "file", back.file);
    }
    fd.append("productId", garment);
    fd.append("size", size);
    if (fits.length > 1) fd.append("fit", FIT_LABEL[fit]);
    if (fabric) fd.append("fabric", fabricTitle(FABRICS[fabric]));
    fd.append("colorName", color);
    fd.append("text", filled.filter((k) => sides[k].kind === "text").map((k) => `${SIDE_LABEL[k]}: ${sides[k].text.trim()}`).join("; "));
    fd.append("comment", fullComment);
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
        <p className="text-muted text-sm mb-8">Ми звʼяжемось з вами на {phone}, щойно опрацюємо макет.</p>
        <Button href="/catalog" variant="ghost">ПЕРЕГЛЯНУТИ КАТАЛОГ</Button>
      </main>
    );
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto md:px-8 md:py-10 md:grid md:grid-cols-[1fr_minmax(0,460px)] md:gap-10 md:items-start">
        {/* ---------- МАКЕТ (липне нагорі) ---------- */}
        <div className="sticky top-[60px] md:top-[84px] z-30 bg-bgSoft md:rounded border-b md:border border-line shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:shadow-none">
          <div className="mx-auto w-full max-w-[300px] md:max-w-[460px] aspect-[400/440] max-h-[34vh] md:max-h-none">
            <GarmentMockup
              garment={garment}
              side={side}
              colorHex={colorObj?.hex ?? "#0A0A0A"}
              printed={cur.printed}
              format={cur.format}
              imageUrl={cur.kind === "image" ? cur.previewUrl : null}
              text={cur.kind === "text" ? cur.text : ""}
              offset={cur.offset}
              onOffset={(o) => patch(side, { offset: o })}
            />
          </div>
          <div className="text-center px-5 pb-3">
            <p className="font-display font-bold text-sm">{cur.printed ? `Принт ${cur.format}` : "Без принта"}</p>
            <p className="text-[11px] text-muted leading-snug mt-0.5">
              {cur.printed ? "Принт можна рухати по макету — надрукуємо так, як на макеті" : `${SIDE_LABEL[side]}: без нанесення`}
            </p>
            <div className="inline-flex mt-3 p-1 bg-paper/10 rounded-full">
              {(["front", "back"] as Side[]).map((k) => (
                <button
                  type="button"
                  key={k}
                  onClick={() => setSide(k)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${side === k ? "bg-paper text-bg" : "text-paper"}`}
                >
                  {SIDE_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- ВИБОРИ ---------- */}
        <div className="px-5 md:px-0 pb-28">
          <h1 className="font-display font-extrabold text-2xl md:text-3xl pt-6 pb-1">СТВОРИ СВІЙ ПРИНТ</h1>

          <Section title="Річ">
            <div className="grid grid-cols-3 gap-2.5">
              {GARMENTS.map((g) => (
                <button type="button" key={g.value} onClick={() => setGarment(g.value)} className={`py-3 ${pill(garment === g.value)}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </Section>

          {fabric && (
            <Section title={garment === "t-shirt" ? "Тип футболки" : "Тканина"}>
              <div className="grid grid-cols-3 gap-2.5">
                {fabricKeys.map((k) => (
                  <button type="button" key={k} onClick={() => setFabric(k)} className={`py-3 px-1 text-center ${pill(fabric === k)}`}>
                    <span className="block capitalize">{FABRICS[k].label.toLowerCase()}</span>
                    <span className="block text-[11px] font-normal opacity-70 mt-0.5">{FABRICS[k].gsm} г/м²</span>
                    <span className="block text-[11px] font-normal opacity-70">від {fromPrice(k)} ₴</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2.5">{FABRICS[fabric].hint}</p>
            </Section>
          )}

          <Section title={garment === "t-shirt" ? "Колір футболки" : "Колір"} aside={color}>
            <div className="grid grid-cols-9 gap-2.5">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`aspect-square rounded-full border ${color === c.name ? "border-bg ring-2 ring-paper" : "border-paper/25"}`}
                />
              ))}
            </div>
          </Section>

          {fits.length > 1 && (
            <Section title="Фасон">
              <div className="grid grid-cols-2 gap-2.5">
                {fits.map((f) => (
                  <button type="button" key={f} onClick={() => setFit(f)} className={`py-3 ${pill(fit === f)}`}>
                    {FIT_LABEL[f]}
                  </button>
                ))}
              </div>
            </Section>
          )}

          <Section title={template.sizeLabel === "ДОВЖИНА" ? "Довжина" : "Розмір"}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => (
                <button type="button" key={sz} onClick={() => setSize(sz)} className={`min-w-[52px] px-3 h-11 ${pill(size === sz)}`}>
                  {sz}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Формат принта" aside={SIDE_WHERE[side]}>
            {cur.printed ? (
              <div className="grid grid-cols-4 gap-2.5">
                {PRINT_FORMATS.map((f) => (
                  <button type="button" key={f} onClick={() => patch(side, { format: f, offset: { x: 0, y: 0 } })} className={`py-3 ${pill(cur.format === f)}`}>
                    {f}
                  </button>
                ))}
              </div>
            ) : (
              <button type="button" onClick={() => patch(side, { printed: true })} className="w-full py-3 border border-dashed border-line text-sm font-semibold">
                + Додати принт {SIDE_WHERE[side]}
              </button>
            )}
          </Section>

          {cur.printed && (
            <Section title="Що друкуємо" aside={SIDE_WHERE[side]}>
              <div className="grid grid-cols-2 p-1 bg-paper/10 rounded mb-3">
                {(["image", "text"] as const).map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => patch(side, { kind: k })}
                    className={`py-2.5 text-sm font-semibold rounded ${cur.kind === k ? "bg-paper text-bg" : "text-paper"}`}
                  >
                    {k === "image" ? "Картинка" : "Напис"}
                  </button>
                ))}
              </div>

              {cur.kind === "image" ? (
                <label className="block border border-dashed border-paper/30 bg-bgSoft rounded p-6 text-center cursor-pointer">
                  <span className="block text-sm font-semibold">{cur.file ? cur.file.name : "↑ Завантажте фото або малюнок"}</span>
                  <span className="block text-xs text-muted mt-1.5">PNG / JPG / WEBP / PDF, чим більше — тим краще (від 1500 px), до 15 МБ</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
                </label>
              ) : (
                <input
                  value={cur.text}
                  onChange={(e) => patch(side, { text: e.target.value })}
                  maxLength={40}
                  placeholder="Напис для нанесення"
                  className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
                />
              )}

              <button
                type="button"
                onClick={() => {
                  if (cur.previewUrl) URL.revokeObjectURL(cur.previewUrl);
                  patch(side, newSide(false));
                }}
                className="mt-4 mx-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-line bg-bgSoft text-sm"
              >
                <span className="w-6 h-6 rounded-full bg-paper text-bg grid place-items-center text-xs leading-none">✕</span>
                Прибрати принт з цієї сторони
              </button>
            </Section>
          )}

          <Section title="Кількість">
            <div className="flex items-center border border-line w-fit">
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-12 h-12 text-lg" aria-label="Зменшити кількість">−</button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => Math.min(999, q + 1))} className="w-12 h-12 text-lg" aria-label="Збільшити кількість">+</button>
            </div>
          </Section>

          <div className="border border-line bg-bgSoft rounded p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted">{garmentDef.label}{fabric ? ` ${FABRICS[fabric].label.toLowerCase()} ${FABRICS[fabric].gsm} г/м²` : ""}</span>
              <span>₴ {basePrice}</span>
            </div>
            {(["front", "back"] as Side[]).map((k) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted">Принт · {SIDE_LABEL[k].toLowerCase()}{sides[k].printed ? ` ${sides[k].format}` : ""}</span>
                <span>{sides[k].printed ? (sideHasContent(sides[k]) ? `₴ ${PRINT_PRICE[sides[k].format]}` : "ще не додано") : "—"}</span>
              </div>
            ))}
            {quantity > 1 && (
              <div className="flex justify-between"><span className="text-muted">× {quantity} шт.</span><span>₴ {unitPrice} / шт.</span></div>
            )}
          </div>

          <Section title="Коментар до замовлення">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Уточнення щодо розміщення принта тощо"
              rows={3}
              className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
            />
          </Section>

          <Section title="Контактні дані">
            <div className="space-y-2.5">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я" className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-bgSoft border border-line px-4 py-3 text-sm" />
            </div>
          </Section>

          <ConsentCheckbox checked={consent} onChange={setConsent} purpose="опрацювання заявки та звʼязку зі мною" />
          {error && <p className="text-xs text-accent mt-4">{error}</p>}

          <div className="mt-6 border border-line bg-bgSoft rounded p-4 flex items-center gap-4">
            <span className="font-display font-extrabold text-3xl">₴ {total}</span>
            <Button type="submit" variant="accent" className="flex-1 py-4" disabled={submitting}>
              {submitting ? "НАДСИЛАННЯ…" : "ВІДПРАВИТИ ЗАЯВКУ"}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
