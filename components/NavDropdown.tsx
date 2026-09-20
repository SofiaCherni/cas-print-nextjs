"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  label: string;
  href: string;
}

/**
 * Accessible dropdown for a top-level nav item (КАТАЛОГ, ПОКУПЦЯМ).
 * Opens on hover (desktop) or click/tap (touch + keyboard), closes on
 * outside click, Escape, or blur past the last item. Plain CSS
 * fade + slight translateY — no animation library, respects
 * prefers-reduced-motion (see .nav-dropdown-panel in globals.css).
 */
export default function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
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
      onBlur={onRootBlur}
    >
      <button
        type="button"
        className={`nav-dropdown-trigger${open ? " open" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className="nav-dropdown-caret" aria-hidden="true" />
      </button>
      <div className={`nav-dropdown-panel${open ? " open" : ""}`} role="menu">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            className="nav-dropdown-item"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
