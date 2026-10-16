import { TRACKING } from "./site-config";

/**
 * Відправка подій у Google Analytics 4, Google Ads та Meta Pixel.
 * Усі функції безпечні: якщо інструмент не підключено або користувач не дав
 * згоду на cookie — нічого не відбувається і помилок немає.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "UAH";

export interface TrackItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  variant?: string;
}

function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

function fbqEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
}

const gaItems = (items: TrackItem[]) =>
  items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    quantity: i.quantity ?? 1,
    item_variant: i.variant
  }));

const metaContents = (items: TrackItem[]) =>
  items.map((i) => ({ id: i.id, quantity: i.quantity ?? 1, item_price: i.price }));

export function trackViewItem(item: TrackItem) {
  gtagEvent("view_item", { currency: CURRENCY, value: item.price, items: gaItems([item]) });
  fbqEvent("ViewContent", {
    content_type: "product",
    content_ids: [item.id],
    content_name: item.name,
    value: item.price,
    currency: CURRENCY
  });
}

export function trackAddToCart(item: TrackItem) {
  const value = item.price * (item.quantity ?? 1);
  gtagEvent("add_to_cart", { currency: CURRENCY, value, items: gaItems([item]) });
  fbqEvent("AddToCart", {
    content_type: "product",
    content_ids: [item.id],
    content_name: item.name,
    contents: metaContents([item]),
    value,
    currency: CURRENCY
  });
}

export function trackBeginCheckout(items: TrackItem[], value: number) {
  gtagEvent("begin_checkout", { currency: CURRENCY, value, items: gaItems(items) });
  fbqEvent("InitiateCheckout", {
    content_type: "product",
    contents: metaContents(items),
    num_items: items.reduce((s, i) => s + (i.quantity ?? 1), 0),
    value,
    currency: CURRENCY
  });
}

export function trackPurchase(orderId: string, items: TrackItem[], value: number) {
  gtagEvent("purchase", { transaction_id: orderId, currency: CURRENCY, value, items: gaItems(items) });
  // Конверсія Google Ads (потрібна мітка конверсії з акаунта Google Ads).
  if (TRACKING.googleAdsId && TRACKING.googleAdsPurchaseLabel) {
    gtagEvent("conversion", {
      send_to: `${TRACKING.googleAdsId}/${TRACKING.googleAdsPurchaseLabel}`,
      value,
      currency: CURRENCY,
      transaction_id: orderId
    });
  }
  fbqEvent("Purchase", {
    content_type: "product",
    contents: metaContents(items),
    value,
    currency: CURRENCY
  });
}

/** Заявка на власний принт (форма «Створити свій»). */
export function trackLead() {
  gtagEvent("generate_lead", { currency: CURRENCY });
  if (TRACKING.googleAdsId && TRACKING.googleAdsLeadLabel) {
    gtagEvent("conversion", { send_to: `${TRACKING.googleAdsId}/${TRACKING.googleAdsLeadLabel}` });
  }
  fbqEvent("Lead", { content_name: "custom_print" });
}

// ---- Згода на cookie ----
export const CONSENT_KEY = "cas-cookie-consent";
export const CONSENT_EVENT = "cas-consent-change";
export type ConsentValue = "granted" | "denied";

export function getStoredConsent(): ConsentValue | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* приватний режим — ігноруємо */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
