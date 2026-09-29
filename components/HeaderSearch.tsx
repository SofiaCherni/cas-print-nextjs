"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";

/**
 * Header search, "accordion" style:
 *  - Wide screens (lg+): a small input unfolds sideways right next to the
 *    magnifier, in the same row as the menu. Clicking the magnifier again
 *    folds it back, leaving only the icon.
 *  - Phones / tablets (no room in the header row): the same toggle opens a
 *    full-width bar under the header instead, so nothing overflows.
 * One open/close state drives both; outside click, Escape and the magnifier
 * itself all close it. Plain CSS transitions (see .header-search-field and
 * .search-bar in globals.css).
 */
export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const barInputRef = useRef<HTMLInputElement>(null);

  // Focus whichever input is actually visible at this screen width.
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    (wide ? inlineInputRef : barInputRef).current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    // The magnifier button lives inside wrapRef, so clicking it is never
    // treated as an "outside" click (which would fight its own toggle).
    function onPointerDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="flex items-center">
      {/* lg+: inline accordion field, same row as the menu */}
      <form onSubmit={handleSubmit} role="search" className="hidden lg:block">
        <div className={`header-search-field${open ? " open" : ""}`}>
          <input
            ref={inlineInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук…"
            className="header-search-input"
            aria-label="Пошук по сайту"
            tabIndex={open ? 0 : -1}
          />
        </div>
      </form>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Згорнути пошук" : "Відкрити пошук"}
        aria-expanded={open}
        className="inline-flex opacity-85 hover:opacity-100 transition-opacity"
      >
        <SearchIcon className="w-[19px] h-[19px]" />
      </button>

      {/* below lg: full-width bar under the header */}
      <div className={`search-bar lg:hidden${open ? " open" : ""}`}>
        <form onSubmit={handleSubmit} role="search" className="search-bar-inner">
          <input
            ref={barInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Що шукаємо?"
            className="search-bar-input"
            aria-label="Пошук по сайту"
            tabIndex={open ? 0 : -1}
          />
          <button type="submit" className="search-bar-submit" tabIndex={open ? 0 : -1}>
            Знайти
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="search-bar-close"
            aria-label="Закрити пошук"
            tabIndex={open ? 0 : -1}
          >
            ×
          </button>
        </form>
      </div>
    </div>
  );
}
