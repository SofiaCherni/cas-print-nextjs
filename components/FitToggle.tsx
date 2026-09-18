"use client";

import { Fit } from "@/lib/types";

const LABELS: Record<Fit, string> = { unisex: "УНІСЕКС", women: "ЖІНОЧИЙ" };

export default function FitToggle({
  options,
  selected,
  onSelect
}: {
  options: Fit[];
  selected: Fit;
  onSelect: (f: Fit) => void;
}) {
  return (
    <div>
      <span className="text-xs tracking-wide text-muted font-bold block mb-3">ФАСОН</span>
      <div className="flex gap-2.5">
        {options.map((f) => (
          <button
            key={f}
            onClick={() => onSelect(f)}
            className={`px-[18px] py-2.5 text-sm font-semibold border ${
              selected === f ? "bg-paper text-bg border-paper" : "border-line text-paper"
            }`}
          >
            {LABELS[f]}
          </button>
        ))}
      </div>
    </div>
  );
}
