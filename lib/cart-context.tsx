"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartLineItem, Product, Variant } from "./types";

interface CartContextValue {
  items: CartLineItem[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  lines: { product: Product; variant: Variant; quantity: number }[];
  /** True once localStorage hydration + the first server resolve finished —
   * check this before rendering an "empty cart" state, so a cart that has
   * items doesn't flash empty while its data is still being fetched. */
  cartReady: boolean;
  phone: string;
  setPhone: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cas-print-cart";
const DETAILS_KEY = "cas-print-cart-details";

/**
 * Cart persistence for a guest user (localStorage) — only the lightweight
 * {productId, variantId, quantity} lines are stored client-side (section 24
 * of the brief). Product name/price/image are no longer bundled into the
 * client at build time (the catalog is a live database now, not a static
 * array), so `lines`/`subtotal` are resolved from the server via
 * POST /api/cart/resolve whenever the cart changes — the same server-side
 * price source /api/checkout already trusts.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [phone, setPhoneState] = useState("");
  const [comment, setCommentState] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<{ product: Product; variant: Variant; quantity: number }[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawDetails = window.localStorage.getItem(DETAILS_KEY);
      if (rawDetails) {
        const details = JSON.parse(rawDetails);
        setPhoneState(details.phone ?? "");
        setCommentState(details.comment ?? "");
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DETAILS_KEY, JSON.stringify({ phone, comment }));
  }, [phone, comment, hydrated]);

  // Resolve product/variant details + price straight from the server
  // whenever the cart's contents change.
  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      setLines([]);
      setSubtotal(0);
      setCartReady(true);
      return;
    }
    let cancelled = false;
    fetch("/api/cart/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setLines(data.lines ?? []);
        setSubtotal(data.subtotal ?? 0);
        setCartReady(true);
      })
      .catch(() => {
        if (!cancelled) setCartReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (productId, variantId, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (variantId, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const removeItem: CartContextValue["removeItem"] = (variantId) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const clear = () => {
    setItems([]);
    setCommentState("");
    // phone is intentionally kept — likely the same customer ordering again
  };

  // Instant, no server round-trip needed — just a count of local quantities.
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        count,
        subtotal,
        lines,
        cartReady,
        phone,
        setPhone: setPhoneState,
        comment,
        setComment: setCommentState
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
