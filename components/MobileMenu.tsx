"use client";

import Link from "next/link";
import { useState } from "react";
import { CATALOG_ITEMS, BUYERS_ITEMS } from "@/lib/nav";

function MobileGroup({
  label,
  items,
  onNavigate
}: {
  label: string;
  items: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 font-display font-extrabold text-3xl text-left"
      >
        {label}
        <span className={`mobile-group-caret${open ? " open" : ""}`} aria-hidden="true" />
      </button>
      <div className={`mobile-group-panel${open ? " open" : ""}`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="block py-3 text-lg text-muted"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col overflow-y-auto">
      <div className="flex justify-end p-5">
        <button onClick={onClose} className="text-2xl" aria-label="Закрити меню">
          ×
        </button>
      </div>
      <nav className="flex flex-col px-8 mt-2 pb-10">
        <MobileGroup label="КАТАЛОГ" items={CATALOG_ITEMS} onNavigate={onClose} />
        <Link
          href="/custom-print"
          onClick={onClose}
          className="font-display font-extrabold text-3xl py-4 border-b border-line"
        >
          СТВОРИТИ СВІЙ
        </Link>
        <Link
          href="/sale"
          onClick={onClose}
          className="font-display font-extrabold text-3xl py-4 border-b border-line nav-sale-link"
        >
          <span className="nav-sale-dot" aria-hidden="true" />
          SALE
        </Link>
        <MobileGroup label="ПОКУПЦЯМ" items={BUYERS_ITEMS} onNavigate={onClose} />
      </nav>
    </div>
  );
}
