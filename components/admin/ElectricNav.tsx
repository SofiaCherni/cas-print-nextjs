"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

export interface ElectricNavItem {
  label: string;
  href: string;
}

/**
 * Premium animated admin navigation (ElectricNav — step 1).
 *
 * ONE shared glow indicator tracks whichever NavItem is active, instead of
 * each item owning its own glow (see file structure: a single .electric-glow
 * div lives in ElectricNav, NavItems never render their own). Its position
 * and width are measured from the active item's real DOM size via
 * getBoundingClientRect and applied as `transform: translateX()` + `width`,
 * both transitioned with CSS — no animation library, matches project deps.
 *
 * Scope: admin navigation only. Does not touch the public site Header,
 * Prisma, API routes, or auth.
 */
export default function ElectricNav({ items }: { items: ElectricNavItem[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [glow, setGlow] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = items.findIndex((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeEl = itemRefs.current[activeIndex];
    if (!container || !activeEl) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setGlow({
        left: itemRect.left - containerRect.left + container.scrollLeft,
        width: itemRect.width
      });
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure once webfonts finish loading — nav item widths can shift
    // slightly between the fallback font and Archivo/Manrope.
    document.fonts?.ready?.then(measure).catch(() => {});

    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, items.length]);

  return (
    <nav ref={containerRef} className="electric-nav" aria-label="Адмін-навігація">
      {glow && (
        <div
          className="electric-glow"
          style={{ transform: `translateX(${glow.left}px)`, width: `${glow.width}px` }}
          aria-hidden="true"
        />
      )}
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`electric-nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
