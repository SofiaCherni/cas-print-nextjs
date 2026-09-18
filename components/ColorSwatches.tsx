"use client";

export default function ColorSwatches({
  colors,
  selected,
  onSelect
}: {
  colors: { name: string; hex: string }[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div>
      <span className="text-xs tracking-wide text-muted font-bold block mb-3">
        КОЛІР — {selected}
      </span>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((c) => (
          <button
            key={c.name}
            title={c.name}
            onClick={() => onSelect(c.name)}
            style={{ backgroundColor: c.hex }}
            className={`w-[26px] h-[26px] rounded-full border ${
              selected === c.name ? "border-paper ring-1 ring-paper" : "border-paper/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
