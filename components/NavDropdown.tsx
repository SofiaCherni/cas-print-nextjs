"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import type { DropdownItem } from "@/lib/nav";

/**
 * Accessible dropdown for a top-level nav item (КАТАЛОГ, ПОКУПЦЯМ).
 * Opens on hover (desktop), click/tap, or keyboard focus; closes on outside
 * click, Escape, or focus leaving. Items may have `children` — those show as
 * a flyout beside the item (pure CSS: hover / focus-within), so e.g.
 * "Класичні" / "Оверсайз" only appear while "Футболки" is hovered.
 * Plain CSS transitions, respects prefers-reduced-motion (globals.css).
 */
export default function NavDropdown({
  label,
  items,
  triggerHref
}: {
  label: string;
  items: DropdownItem[];
  /** When set, the trigger itself is a link (e.g. КАТАЛОГ → /catalog) and
   * navigates on click, while hover still opens the panel underneath it. */
  triggerHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  // Keyboard users: opening on focus lets Tab move through the (otherwise
  // hidden) items. Only for :focus-visible so a plain mouse click on the
  // toggle button doesn't open-then-immediately-close it.
  function onRootFocus(e: React.FocusEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).matches?.(":focus-visible")) openNow();
  }

  function onRootBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="nav-dropdown-root"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={onRootFocus}
      onBlur={onRootBlur}
    >
      {triggerHref ? (
        <Link
          href={triggerHref}
          className={`nav-dropdown-trigger${open ? " open" : ""}`}
          aria-haspopup="true"
          aria-expanded={open}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          className={`nav-dropdown-trigger${open ? " open" : ""}`}
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {label}
        </button>
      )}
      <div className={`nav-dropdown-panel${open ? " open" : ""}`} role="menu">
        {items.map((item) =>
          item.children && item.children.length > 0 ? (
            <div key={item.href} className="nav-dropdown-sub">
              <Link
                href={item.href}
                role="menuitem"
                aria-haspopup="true"
                className="nav-dropdown-item"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              <div className="nav-dropdown-subpanel" role="menu">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className="nav-dropdown-item"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="nav-dropdown-item"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
