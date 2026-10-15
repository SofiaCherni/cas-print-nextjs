"use client";

import { EXTENDED_SIZES, Size } from "@/lib/types";

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  label = "РОЗМІР",
  guideId = null
}: {
  sizes: Size[];
  selected: Size | null;
  onSelect: (s: Size) => void;
  label?: string;
  // Якір на сторінці /size-guide; null — сітки для цього товару немає.
  guideId?: string | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs tracking-wide text-muted font-bold">{label}</span>
        {guideId && (
          <a href={`/size-guide#${guideId}`} className="text-xs underline">
            РОЗМІРНА СІТКА
          </a>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const extended = EXTENDED_SIZES.includes(s);
          const isSelected = selected === s;
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={`min-w-[48px] px-3 h-11 flex items-center justify-center text-xs font-bold border ${
                isSelected
                  ? "bg-paper text-bg border-paper"
                  : extended
                  ? "border-accent text-accent"
                  : "border-line text-paper"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      {selected && EXTENDED_SIZES.includes(selected) && (
        <p className="text-xs text-accent mt-2.5">
          3XL–5XL +₴50. Обмін та повернення для цих розмірів недоступні.
        </p>
      )}
    </div>
  );
}
