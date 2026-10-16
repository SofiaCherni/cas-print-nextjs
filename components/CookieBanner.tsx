"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TRACKING_ENABLED } from "@/lib/site-config";
import { getStoredConsent, setStoredConsent } from "@/lib/analytics";

/** Банер згоди на cookie. Показується лише якщо підключена аналітика/реклама і вибір ще не зроблено. */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (TRACKING_ENABLED && getStoredConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(value: "granted" | "denied") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Згода на використання cookie"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-line bg-panel px-5 md:px-8 py-4"
    >
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <p className="text-xs text-muted leading-relaxed max-w-3xl">
          Ми використовуємо cookie для аналітики та реклами (Google Analytics, Google Ads, Meta), щоб покращувати сайт і
          показувати релевантні оголошення. Деталі — у{" "}
          <Link href="/privacy" className="underline hover:text-paper">Політиці конфіденційності</Link>.
        </p>
        <div className="flex gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="px-4 py-2.5 border border-line text-xs font-bold tracking-wide"
          >
            ЛИШЕ НЕОБХІДНІ
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="px-4 py-2.5 bg-accent text-xs font-bold tracking-wide hover:bg-accentHover transition-colors"
          >
            ПРИЙНЯТИ
          </button>
        </div>
      </div>
    </div>
  );
}
