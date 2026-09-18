"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLineItem, Product, Variant } from "./types";
import { PRODUCTS } from "./data";

interface CartContextValue {
  items: CartLineItem[];
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  lines: { product: Product; variant: Variant; quantity: number }[];
  phone: string;
  setPhone: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cas-print-cart";
const DETAILS_KEY = "cas-print-cart-details";

/**
 * Cart persistence for a guest user (localStorage), matching section 24 of
 * the brief. Phone and comment are entered on the cart page and carried
 * through to checkout, so the customer doesn't retype the phone number
 * (comment is a note for the order — e.g. "подзвонити після 18:00").
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [phone, setPhoneState] = useState("");
  const [comment, setCommentState] = useState("");
  const [hydrated, setHydrated] = useState(false);

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

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        if (!product || !variant) return null;
        return { product, variant, quantity: item.quantity };
      })
      .filter((x): x is { product: Product; variant: Variant; quantity: number } => x !== null);
  }, [items]);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);

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
