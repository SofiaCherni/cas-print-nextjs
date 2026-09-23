"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PRINT_CATEGORIES } from "@/lib/catalog-constants";
import { Fit, Size } from "@/lib/types";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const FITS: { value: Fit; label: string }[] = [
  { value: "unisex", label: "Унісекс" },
  { value: "women", label: "Жіночий" }
];
const COLORS = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Молочний", hex: "#F2F0EB" },
  { name: "Сірий", hex: "#8A8A8A" },
  { name: "Теракотовий", hex: "#B3402E" },
  { name: "Хакі", hex: "#2F3B2A" }
];

/**
 * Filters are driven entirely by URL search params (?category=&size=&color=&fit=&price=)
 * so state survives a page reload and can be shared as a link (brief section 22).
 */
export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const active = (key: string, value: string) => searchParams.get(key) === value;

  return (
    <aside className="space-y-8">
      <div>
        <h4 className="text-xs tracking-wide text-muted font-bold mb-3.5">КАТЕГОРІЯ ПРИНТУ</h4>
        <div className="space-y-2.5">
          {PRINT_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setParam("printCategory", c.value)}
              className={`flex items-center gap-2.5 text-sm ${
                active("printCategory", c.value) ? "text-paper" : "text-paper/85"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 border rounded-sm ${
                  active("printCategory", c.value) ? "bg-paper border-paper" : "border-muted"
                }`}
              />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-wide text-muted font-bold mb-3.5">РОЗМІР</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setParam("size", s)}
              className={`px-3 py-2 text-xs font-bold border ${
                active("size", s) ? "bg-paper text-bg border-paper" : "border-line text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-wide text-muted font-bold mb-3.5">КОЛІР</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              title={c.name}
              onClick={() => setParam("color", c.name)}
              style={{ backgroundColor: c.hex }}
              className={`w-[26px] h-[26px] rounded-full border ${
                active("color", c.name) ? "border-paper ring-1 ring-paper" : "border-paper/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-wide text-muted font-bold mb-3.5">ФАСОН</h4>
        <div className="space-y-2.5">
          {FITS.map((f) => (
            <button
              key={f.value}
              onClick={() => setParam("fit", f.value)}
              className={`flex items-center gap-2.5 text-sm ${
                active("fit", f.value) ? "text-paper" : "text-paper/85"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 border rounded-sm ${
                  active("fit", f.value) ? "bg-paper border-paper" : "border-muted"
                }`}
              />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs tracking-wide text-muted font-bold mb-3.5">ЦІНА</h4>
        <div className="space-y-2.5">
          <button
            onClick={() => setParam("maxPrice", "1000")}
            className={`flex items-center gap-2.5 text-sm ${
              active("maxPrice", "1000") ? "text-paper" : "text-paper/85"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 border rounded-sm ${
                active("maxPrice", "1000") ? "bg-paper border-paper" : "border-muted"
              }`}
            />
            до 1000 ₴
          </button>
          <button
            onClick={() => setParam("minPrice", "1000")}
            className={`flex items-center gap-2.5 text-sm ${
              active("minPrice", "1000") ? "text-paper" : "text-paper/85"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 border rounded-sm ${
                active("minPrice", "1000") ? "bg-paper border-paper" : "border-muted"
              }`}
            />
            1000–2000 ₴
          </button>
        </div>
      </div>

      <button onClick={() => router.push(pathname)} className="text-xs underline text-muted">
        Скинути фільтри
      </button>
    </aside>
  );
}
