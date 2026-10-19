"use client";

import { FABRICS, FabricKey } from "@/lib/product-templates";
import { formatPrice } from "@/lib/catalog-constants";

/**
 * Вибір типу тканини в картці товару: СТАНДАРТ — 155 г/м², ПРЕМІУМ — 185 г/м²,
 * ОВЕРСАЙЗ — 240 г/м². Під кожним — «від» ціна цієї тканини (з урахуванням знижки).
 */
export default function FabricSelector({
  options,
  selected,
  onSelect
}: {
  options: { key: FabricKey; price: number; oldPrice: number | null }[];
  selected: FabricKey;
  onSelect: (key: FabricKey) => void;
}) {
  const current = FABRICS[selected];
  return (
    <div>
      <span className="text-xs tracking-wide text-muted font-bold block mb-3">ТКАНИНА</span>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const f = FABRICS[o.key];
          const isSelected = o.key === selected;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onSelect(o.key)}
              className={`px-3 py-3 text-left border ${
                isSelected ? "bg-paper text-bg border-paper" : "border-line text-paper"
              }`}
            >
              <span className="block text-xs font-bold tracking-wide">{f.label}</span>
              <span className={`block text-[11px] mt-0.5 ${isSelected ? "text-bg/70" : "text-muted"}`}>
                {f.gsm} г/м²
              </span>
              <span className="block text-[12px] font-semibold mt-1.5">
                {o.oldPrice !== null && (
                  <span className="line-through mr-1.5 font-normal text-[#A20D20]">
                    {formatPrice(o.oldPrice)}
                  </span>
                )}
                {formatPrice(o.price)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-2.5 leading-relaxed">{current.hint}</p>
    </div>
  );
}
