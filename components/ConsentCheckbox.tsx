"use client";

import Link from "next/link";

/** Обовʼязкова згода на обробку персональних даних біля кнопки відправки форми. */
export default function ConsentCheckbox({
  checked,
  onChange,
  purpose
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Для чого обробляються дані, напр. «оформлення замовлення та звʼязку зі мною». */
  purpose: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer mt-5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#710009]"
      />
      <span className="text-xs text-muted leading-relaxed">
        Я даю згоду на обробку моїх персональних даних для {purpose} відповідно до{" "}
        <Link href="/privacy" target="_blank" className="underline hover:text-paper">
          Політики конфіденційності
        </Link>
        .
      </span>
    </label>
  );
}
