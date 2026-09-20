"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import MobileMenu from "./MobileMenu";
import NavDropdown from "./NavDropdown";
import { CATALOG_ITEMS, BUYERS_ITEMS } from "@/lib/nav";

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between transition-all ${
        compact ? "py-3 bg-bg/85 backdrop-blur border-b border-line" : "py-6"
      } px-5 md:px-8`}
    >
      <Link href="/" className="font-display font-black text-lg md:text-xl tracking-tight">
        CAS·PRINT
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold tracking-wide">
        <NavDropdown label="КАТАЛОГ" items={CATALOG_ITEMS} />
        <Link href="/custom-print" className="opacity-85 hover:opacity-100">
          СТВОРИТИ СВІЙ
        </Link>
        <Link href="/sale" className="nav-sale-link">
          <span className="nav-sale-dot" aria-hidden="true" />
          SALE
        </Link>
        <NavDropdown label="ПОКУПЦЯМ" items={BUYERS_ITEMS} />
      </nav>

      <div className="flex items-center gap-5 text-[13px] font-semibold tracking-wide">
        <button className="hidden sm:inline opacity-85 hover:opacity-100" aria-label="Пошук">
          ПОШУК
        </button>
        <Link href="/account/favorites" className="hidden sm:inline opacity-85 hover:opacity-100">
          ОБРАНЕ
        </Link>
        <Link href="/cart" className="opacity-85 hover:opacity-100">
          КОШИК
          {count > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-paper text-[10px] font-extrabold">
              {count}
            </span>
          )}
        </Link>
        <button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Меню">
          ☰
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
