"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPrintPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showOnHome, setShowOnHome] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ті самі категорії, що й у формі «Додати товар» (товари + принти разом).
  useEffect(() => {
    fetch("/api/admin/print-categories")
      .then((res) => res.json())
      .then((data) => setExistingCategories(data.categories ?? []))
      .catch(() => {});
  }, []);

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося завантажити фото.");
        return;
      }
      setImageUrl(data.url);
    } catch {
      setError("Помилка завантаження фото.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (uploading) {
      setError("Дочекайтесь завершення завантаження фото.");
      return;
    }
    if (!imageUrl) {
      setError("Додайте фото принта.");
      return;
    }
    if (!name.trim()) {
      setError("Вкажіть назву принта.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/prints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category: category.trim() || undefined,
          image: imageUrl,
          showOnHome
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не вдалося створити принт.");
        return;
      }
      router.push("/admin/prints");
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
        <h1 className="font-display font-extrabold text-3xl mb-10">ДОДАТИ ПРИНТ</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">НАЗВА</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Наприклад: Сакура"
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
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">
              КАТЕГОРІЯ ПРИНТУ (необов'язково)
            </label>
            <input
              list="print-category-options"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
                ? `Уже є (спільні з товарами): ${existingCategories.join(", ")} — почни вводити, щоб обрати, або впиши нову.`
                : "Категорій ще немає — введи свою, вона з'явиться в списку і для товарів, і для принтів."}
            </p>
          </div>

          <div>
            <label className="block text-xs tracking-wide text-muted font-bold mb-2">ФОТО ПРИНТА</label>
            <label className="block border border-dashed border-line p-6 text-center text-xs text-muted cursor-pointer mb-3">
              {uploading ? "Завантаження…" : "Натисни, щоб обрати фото (PNG, JPG, WEBP)"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleFile(e.target.files)}
              />
            </label>
            {imageUrl && (
              <div className="relative w-40 aspect-[3/4] bg-bgSoft border border-line overflow-hidden">
                {/* Admin preview only — plain <img>, no next/image needed. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-bg/80 text-paper text-xs"
                  aria-label="Видалити фото"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} />
            Показувати на головній (блок «ОБЕРИ СВІЙ ПРИНТ»)
          </label>

          {error && <p className="text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-4 bg-accent text-paper text-sm font-bold tracking-wide rounded border border-accent hover:bg-paper hover:text-accent transition-colors duration-300 disabled:opacity-50"
          >
            {submitting ? "СТВОРЕННЯ…" : "СТВОРИТИ ПРИНТ"}
          </button>
        </form>
      </div>
    </main>
  );
}
