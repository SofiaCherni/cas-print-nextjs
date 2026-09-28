"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Expanding search bar anchored under the header. Opens on click of the
 * search icon (see Header.tsx), closes on outside click, Escape, or after
 * submitting a query — plain CSS transition, no animation library.
 */
export default function SearchBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose();
  }

  return (
    <div ref={rootRef} className={`search-bar${open ? " open" : ""}`}>
      <form onSubmit={handleSubmit} className="wrap search-bar-inner">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Що шукаємо?"
          className="search-bar-input"
          aria-label="Пошук по сайту"
        />
        <button type="submit" className="search-bar-submit">Знайти</button>
        <button type="button" onClick={onClose} className="search-bar-close" aria-label="Закрити пошук">
          ×
        </button>
      </form>
    </div>
  );
}
