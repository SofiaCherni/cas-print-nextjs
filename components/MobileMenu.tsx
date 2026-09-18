"use client";

import Link from "next/link";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const links = [
    { href: "/catalog", label: "КАТАЛОГ" },
    { href: "/catalog/t-shirts", label: "ФУТБОЛКИ" },
    { href: "/catalog/hoodies", label: "ХУДІ" },
    { href: "/catalog", label: "ПРИНТИ" },
    { href: "/custom-print", label: "СТВОРИТИ СВІЙ" }
  ];
  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      <div className="flex justify-end p-5">
        <button onClick={onClose} className="text-2xl" aria-label="Закрити меню">
          ×
        </button>
      </div>
      <nav className="flex flex-col gap-2 px-8 mt-6">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={onClose}
            className="font-display font-extrabold text-3xl py-4 border-b border-line"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
