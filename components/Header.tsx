"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import MobileMenu from "./MobileMenu";
import NavDropdown from "./NavDropdown";
import { CATALOG_ITEMS, BUYERS_ITEMS } from "@/lib/nav";
import { BagIcon } from "./icons";
import HeaderSearch from "./HeaderSearch";

function getActiveSlot(pathname: string): number {
  if (pathname.startsWith("/catalog")) return 0;
  if (pathname.startsWith("/custom-print")) return 1;
  if (pathname.startsWith("/sale")) return 2;
  if (pathname.startsWith("/delivery-and-payment") || pathname.startsWith("/returns")) return 3;
  return -1;
}

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null);

  const activeSlot = getActiveSlot(pathname);

  useLayoutEffect(() => {
    const container = navRef.current;
    const activeEl = slotRefs.current[activeSlot];
    if (!container || !activeEl) {
      setUnderline(null);
      return;
    }

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setUnderline({ left: itemRect.left - containerRect.left, width: itemRect.width });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSlot]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`relative sticky top-0 z-40 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] transition-all ${
        compact ? "py-3 bg-bg/85 backdrop-blur border-b border-line" : "py-6"
      } px-5 md:px-8`}
    >
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/logo.png"
          alt="CAS·PRINT — Print / Wear / Be You"
          width={220}
          height={64}
          priority
          className="h-[34px] md:h-[38px] w-auto"
        />
      </Link>

      <nav ref={navRef} className="main-nav hidden md:flex items-center gap-9 text-[14px] font-semibold tracking-wide">
        <div
          ref={(el) => {
            slotRefs.current[0] = el;
          }}
        >
          <NavDropdown label="КАТАЛОГ" items={CATALOG_ITEMS} triggerHref="/catalog" />
        </div>

        <div
          ref={(el) => {
            slotRefs.current[1] = el;
          }}
        >
          <Link href="/custom-print" className="opacity-85 hover:opacity-100 transition-opacity">
            СТВОРИТИ СВІЙ
          </Link>
        </div>

        <div
          ref={(el) => {
            slotRefs.current[2] = el;
          }}
        >
          <Link
            href="/sale"
            className="inline-flex items-center rounded-full bg-accent text-paper px-4 py-[6px] leading-none transition-colors duration-300 hover:bg-paper hover:text-accent"
          >
            SALE
          </Link>
        </div>

        <div
          ref={(el) => {
            slotRefs.current[3] = el;
          }}
        >
          <NavDropdown label="ПОКУПЦЯМ" items={BUYERS_ITEMS} />
        </div>

        {underline && (
          <div
            className="main-nav-underline"
            style={{ transform: `translateX(${underline.left}px)`, width: `${underline.width}px` }}
            aria-hidden="true"
          />
        )}
      </nav>

      <div className="flex items-center gap-5 lg:justify-self-end">
        <HeaderSearch />
        <Link
          href="/cart"
          className="relative inline-flex opacity-85 hover:opacity-100 transition-opacity"
          aria-label="Кошик"
        >
          <BagIcon className="w-[19px] h-[19px]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent text-paper text-[10px] font-extrabold">
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
