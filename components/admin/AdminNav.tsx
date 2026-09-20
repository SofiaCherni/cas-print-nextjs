"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

export interface AdminNavItem {
  label: string;
  href: string;
}

/**
 * Simple admin section nav: two tabs with a thin underline that slides to
 * the active one. Replaces the earlier ElectricNav (glow/blur indicator) —
 * kept only the smooth position/width transition, dropped all the glow
 * styling per request. No animation library, same measurement approach as
 * before (getBoundingClientRect + transform/width transition).
 */
export default function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = items.findIndex((item) => pathname.startsWith(item.href));

  useLayoutEffect(() => {
    const container = containerRef.current;
    const activeEl = itemRefs.current[activeIndex];
    if (!container || !activeEl) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setUnderline({
        left: itemRect.left - containerRect.left + container.scrollLeft,
        width: itemRect.width
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex, items.length]);

  return (
    <nav ref={containerRef} className="admin-nav" aria-label="Адмін-навігація">
      {items.map((item, i) => {
        const isActive = i === activeIndex;
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`admin-nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
      {underline && (
        <div
          className="admin-nav-underline"
          style={{ transform: `translateX(${underline.left}px)`, width: `${underline.width}px` }}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
