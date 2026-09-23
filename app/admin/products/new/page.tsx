"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_CATEGORIES = [
  { value: "t-shirts", label: "Футболки" },
  { value: "sweatshirts", label: "Світшоти" },
  { value: "hoodies", label: "Худі" },
  { value: "basics", label: "Інші товари" }
];

const COLOR_PALETTE = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Молочний", hex: "#F2F0EB" },
  { name: "Сірий", hex: "#8A8A8A" },
  { name: "Теракотовий", hex: "#B3402E" },
  { name: "Хакі", hex: "#2F3B2A" }
];

const FITS = [
  { value: "unisex", label: "Унісекс" },
  { value: "women", label: "Жіночий" }
];

interface UploadedImage {
  file: File;
  url?: string;
  uploading: boolean;
  error?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [baseCategory, setBaseCategory] = useState(BASE_CATEGORIES[0].value);
  const [basePrice, setBasePrice] = useState("");
  const [fits, setFits] = useState<string[]>(["unisex"]);
  const [colors, setColors] = useState<string[]>([COLOR_PALETTE[0].name]);
  const [popular, setPopular] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
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
    if (!name || !description || !basePrice) {
      setError("Заповніть назву, опис і ціну.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          baseCategory,
          basePrice: Number(basePrice),
          images: readyImages,
          fits,
          colors: COLOR_PALETTE.filter((c) => colors.includes(c.name)),
          popular,
          onSale,
          salePrice: onSale ? Number(salePrice) : undefined
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide text-muted font-bold mb-2">КАТЕГОРІЯ</label>
              <select
                value={baseCategory}
                onChange={(e) => setBaseCategory(e.target.value)}
                className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
              >
                {BASE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-wide text-muted font-bold mb-2">БАЗОВА ЦІНА, ₴</label>
              <input
                type="number"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-bgSoft border border-line px-4 py-3 text-sm"
              />
              <p className="text-xs text-muted mt-1.5">Розміри 3XL–5XL автоматично +50 ₴.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">ФАСОН</label>
            <div className="flex gap-2.5">
              {FITS.map((f) => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => toggle(fits, f.value, setFits)}
                  className={`px-4 py-2.5 border text-sm font-semibold ${
                    fits.includes(f.value) ? "bg-paper text-bg border-paper" : "border-line"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">КОЛЬОРИ</label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggle(colors, c.name, setColors)}
                  className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-semibold ${
                    colors.includes(c.name) ? "border-paper" : "border-line text-muted"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-paper/30" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-1.5">
              Кожен розмір × фасон × колір стане окремим варіантом товару.
            </p>
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
              <div className="pl-6">
                <label className="block text-xs tracking-wide text-muted font-bold mb-2">АКЦІЙНА ЦІНА, ₴</label>
                <input
                  type="number"
                  min="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full max-w-[200px] bg-bgSoft border border-line px-4 py-3 text-sm"
                />
              </div>
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
