"use client";

export default function QuantityStepper({
  value,
  onChange,
  small
}: {
  value: number;
  onChange: (v: number) => void;
  small?: boolean;
}) {
  return (
    <div className={`flex items-center border border-line w-fit ${small ? "" : ""}`}>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className={`flex items-center justify-center ${small ? "w-7 h-7" : "w-[42px] h-[42px]"}`}
        aria-label="Зменшити кількість"
      >
        −
      </button>
      <span className={`text-center ${small ? "w-6 text-xs" : "w-10 text-sm"}`}>{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className={`flex items-center justify-center ${small ? "w-7 h-7" : "w-[42px] h-[42px]"}`}
        aria-label="Збільшити кількість"
      >
        +
      </button>
    </div>
  );
}
