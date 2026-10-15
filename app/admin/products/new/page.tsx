"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_TEMPLATES, getTemplate, templateGroups, colorsByName } from "@/lib/product-templates";
import { BASE_CATEGORIES } from "@/lib/catalog-constants";
import { ProductBaseCategory } from "@/lib/types";

const FIT_LABEL: Record<string, string> = { unisex: "унісекс", women: "жіноча" };

function describeSizes(sizesByFit: Record<string, string[] | undefined>): string {
  const entries = Object.entries(sizesByFit) as [string, string[]][];
  return entries
    .map(([fit, sizes]) => {
      const range = sizes.length > 2 ? `${sizes[0]}–${sizes[sizes.length - 1]}` : sizes.join(" / ");
      return entries.length > 1 ? `${FIT_LABEL[fit] ?? fit} ${range}` : range;
    })
    .join("; ");
}

// Який шаблон обирається за категорією (для футболок — за підкатегорією).
const DEFAULT_TYPE_FOR_CATEGORY: Record<ProductBaseCategory, string> = {
  "t-shirts": "tshirt-classic",
  sweatshirts: "sweatshirt",
  hoodies: "hoodie",
  basics: "pillow"
};
const BASICS_TYPES = PRODUCT_TEMPLATES.filter((t) => t.baseCategory === "basics");

interface UploadedImage {
  file: File;
  url?: string;
  uploading: boolean;
  error?: string;
}

// Ключ групи «ціна + кольори»: ключ тканини або "default", якщо тканин у типу немає.
const gk = (key: string | undefined) => key ?? "default";

function initialColors(typeKey: string): Record<string, string[]> {
  const t = getTemplate(typeKey)!;
  return Object.fromEntries(templateGroups(t).map((g) => [gk(g.key), colorsByName(g.colors).map((c) => c.name)]));
}

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(getTemplate("tshirt-classic")!.description);
  const [productType, setProductType] = useState("tshirt-classic");
  const [printCategory, setPrintCategory] = useState("");
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const template = getTemplate(productType)!;
  const groups = templateGroups(template);
  // Ціна, акційна ціна та кольори — окремо для кожної тканини.
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [salePrices, setSalePrices] = useState<Record<string, string>>({});
  const [colorSel, setColorSel] = useState<Record<string, string[]>>(() => initialColors("tshirt-classic"));
  const [popular, setPopular] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/print-categories")
      .then((res) => res.json())
      .then((data) => setExistingCategories(data.categories ?? []))
      .catch(() => {});
  }, []);

  // Зміна категорії/підкатегорії: підставляємо кольори й опис нового шаблону.
  // Опис перезаписуємо лише якщо він порожній або ще дефолтний від попереднього типу.
  function changeType(key: string) {
    const prev = getTemplate(productType);
    const next = getTemplate(key);
    if (!next || key === productType) return;
    setProductType(key);
    setColorSel(initialColors(key));
    if (!description.trim() || description === prev?.description) setDescription(next.description);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newEntries: UploadedImage[] = Array.from(fileList).map((file) => ({ file, uploading: true }));
    setImages((prev) => [...prev, ...newEntries]);

    for (const entry of newEntries) {
      const fd = new FormData();
      fd.append("file", entry.file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.file === entry.file
              ? { ...img, uploading: false, url: res.ok ? data.url : undefined, error: res.ok ? undefined : data.error }
              : img
          )
        );
      } catch {
        setImages((prev) =>
          prev.map((img) => (img.file === entry.file ? { ...img, uploading: false, error: "Помилка завантаження" } : img))
        );
      }
    }
  }

  function removeImage(file: File) {
    setImages((prev) => prev.filter((img) => img.file !== file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const readyImages = images.filter((img) => img.url).map((img) => img.url!) as string[];
    if (readyImages.length === 0) {
      setError("Додайте хоча б одне фото й дочекайтесь завершення завантаження.");
      return;
    }
    if (images.some((img) => img.uploading)) {
      setError("Дочекайтесь завершення завантаження всіх фото.");
      return;
    }
    if (!name || !description) {
      setError("Заповніть назву й опис.");
      return;
    }
    if (onSale && !groups.some((g) => (salePrices[gk(g.key)] ?? "").trim() !== "")) {
      setError("Вкажіть акційну ціну хоча б для однієї тканини (або зніми «На розпродажі»).");
      return;
    }
    for (const g of groups) {
      const label = g.title ? ` (${g.title})` : "";
      if (!Number(prices[gk(g.key)]) || Number(prices[gk(g.key)]) <= 0) {
        setError(`Вкажіть ціну${label}.`);
        return;
      }
      const spRaw = (salePrices[gk(g.key)] ?? "").trim();
      if (onSale && spRaw !== "") {
        const sp = Number(spRaw);
        if (!sp || sp <= 0 || sp >= Number(prices[gk(g.key)])) {
          setError(`Акційна ціна${label} має бути меншою за звичайну.`);
          return;
        }
      }
      if ((colorSel[gk(g.key)] ?? []).length === 0) {
        setError(`Оберіть хоча б один колір${label}.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          productType: template.key,
          baseCategory: template.baseCategory,
          cutStyle: template.cutStyle,
          printCategory: printCategory.trim() || undefined,
          images: readyImages,
          groups: groups.map((g) => ({
            fabric: g.key,
            price: Number(prices[gk(g.key)]),
            salePrice: onSale && (salePrices[gk(g.key)] ?? "").trim() !== "" ? Number(salePrices[gk(g.key)]) : undefined,
            colors: colorsByName(g.colors).filter((c) => (colorSel[gk(g.key)] ?? []).includes(c.name))
          })),
          popular,
          onSale
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося створити товар.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Не вдалося звʼязатися з сервером.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-2xl mx-auto py-16 pb-28">
        <h1 className="font-display font-extrabold text-3xl mb-10">ДОДАТИ ТОВАР</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">НАЗВА</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Наприклад: Футболка «Сакура»'
              className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">ОПИС</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">КАТЕГОРІЯ</label>
            <select
              value={template.baseCategory}
              onChange={(e) => changeType(DEFAULT_TYPE_FOR_CATEGORY[e.target.value as ProductBaseCategory])}
              className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
            >
              {BASE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            {template.baseCategory === "t-shirts" && (
              <div className="flex gap-2.5 mt-3">
                {[
                  { key: "tshirt-classic", label: "КЛАСИЧНІ" },
                  { key: "tshirt-oversize", label: "ОВЕРСАЙЗ" }
                ].map((o) => (
                  <button
                    type="button"
                    key={o.key}
                    onClick={() => changeType(o.key)}
                    className={`px-5 py-2.5 text-xs font-bold tracking-wide border ${
                      productType === o.key ? "bg-paper text-bg border-paper" : "border-line text-paper"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {template.baseCategory === "basics" && (
              <select
                value={productType}
                onChange={(e) => changeType(e.target.value)}
                className="w-full bg-bgSoft border border-line px-4 py-3 text-sm mt-3"
              >
                {BASICS_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            )}

            <p className="text-xs text-muted mt-1.5">
              {template.fabrics
                ? "Покупець сам обере тканину (СТАНДАРТ / ПРЕМІУМ / ОВЕРСАЙЗ) у картці товару. «Класичні / Оверсайз» лише визначає, у якому розділі каталогу буде товар. Ціну й кольори задай для кожної тканини."
                : `Розміри: ${describeSizes(template.sizesByFit)}. Кольори, розміри й початковий опис підставляються за типом.`}
            </p>
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">
              КАТЕГОРІЯ ПРИНТУ (необов'язково)
            </label>
            <input
              list="print-category-options"
              value={printCategory}
              onChange={(e) => setPrintCategory(e.target.value)}
              placeholder="Наприклад: Аніме"
              className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
            />
            <datalist id="print-category-options">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <p className="text-xs text-muted mt-1.5">
              {existingCategories.length > 0
                ? `Уже є: ${existingCategories.join(", ")} — почни вводити, щоб обрати, або впиши нову.`
                : "Категорій ще немає — введи свою, вона з'явиться в списку для наступних товарів."}
            </p>
          </div>

          <div className="space-y-8">
            {groups.map((g) => {
              const k = gk(g.key);
              const palette = colorsByName(g.colors);
              const selected = colorSel[k] ?? [];
              return (
                <div key={k} className="border border-line p-5 space-y-5">
                  {g.title && <h2 className="font-display font-extrabold text-lg">{g.title}</h2>}
                  <p className="text-xs text-muted">Розміри: {describeSizes(g.sizesByFit)}. 3XL–5XL автоматично +50 ₴.</p>

                  <div className="flex flex-wrap gap-5">
                    <div>
                      <label className="block text-xs tracking-wide text-muted font-bold mb-2">ЦІНА, ₴</label>
                      <input
                        type="number"
                        min="0"
                        value={prices[k] ?? ""}
                        onChange={(e) => setPrices((p) => ({ ...p, [k]: e.target.value }))}
                        className="w-full max-w-[200px] bg-bgSoft border border-line px-4 py-3 text-sm"
                      />
                    </div>
                    {onSale && (
                      <div>
                        <label className="block text-xs tracking-wide text-muted font-bold mb-2">АКЦІЙНА ЦІНА, ₴ <span className="font-normal">(лишіть порожнім, якщо акції немає)</span></label>
                        <input
                          type="number"
                          min="0"
                          value={salePrices[k] ?? ""}
                          onChange={(e) => setSalePrices((p) => ({ ...p, [k]: e.target.value }))}
                          className="w-full max-w-[200px] bg-bgSoft border border-line px-4 py-3 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs tracking-wide text-muted font-bold">КОЛЬОРИ</label>
                      <button
                        type="button"
                        onClick={() =>
                          setColorSel((c) => ({
                            ...c,
                            [k]: selected.length === palette.length ? [] : palette.map((x) => x.name)
                          }))
                        }
                        className="text-xs underline text-muted hover:text-paper"
                      >
                        {selected.length === palette.length ? "Зняти всі" : "Обрати всі кольори"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {palette.map((c) => (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() =>
                            setColorSel((cs) => ({
                              ...cs,
                              [k]: selected.includes(c.name) ? selected.filter((n) => n !== c.name) : [...selected, c.name]
                            }))
                          }
                          className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-semibold ${
                            selected.includes(c.name) ? "border-paper" : "border-line text-muted"
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-paper/30" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted mt-1.5">
                      Зніми колір, якого немає для цього принта. Кожен розмір × колір стане окремим варіантом.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">ФОТО</label>
            <label className="block border border-dashed border-line p-6 text-center text-xs text-muted cursor-pointer mb-3">
              Перетягни фото сюди або натисни для завантаження (PNG, JPG, WEBP)
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-bgSoft border border-line overflow-hidden">
                    {img.url && (
                      // Admin preview only — fine as a plain <img>, no next/image config needed for blob URLs.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    )}
                    {img.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted">
                        Завантаження…
                      </div>
                    )}
                    {img.error && (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-accent p-1 text-center">
                        {img.error}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.file)}
                      className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-bg/80 text-paper text-xs"
                      aria-label="Видалити фото"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
              Показувати в «Популярне» на головній
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />
              На розпродажі (SALE)
            </label>
            {onSale && (
              <p className="text-xs text-muted pl-6">
                Акційну ціну вкажи лише для тих тканин, на які діє знижка; решта лишаться за звичайною ціною. На сайті стара ціна буде закреслена, поруч — нова.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-accent text-paper text-sm font-bold tracking-wide rounded border border-accent hover:bg-paper hover:text-accent transition-colors duration-300 disabled:opacity-50"
          >
            {submitting ? "СТВОРЕННЯ…" : "СТВОРИТИ ТОВАР"}
          </button>
        </form>
      </div>
    </main>
  );
}
