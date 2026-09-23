import { PrintCategory, ProductBaseCategory } from "./types";

/**
 * Pure, DB-free constants and helpers. Deliberately kept out of lib/data.ts
 * (which now imports the Prisma client) so client components can import
 * these directly without pulling Prisma into the browser bundle.
 */

export const PRINT_CATEGORIES: { value: PrintCategory; label: string }[] = [
  { value: "anime", label: "Аніме" },
  { value: "text", label: "Текст" },
  { value: "memes", label: "Меми" },
  { value: "ukrainian", label: "Українське" },
  { value: "cartoons", label: "Мультфільми" },
  { value: "movies", label: "Кіно" },
  { value: "music", label: "Музика" },
  { value: "other", label: "Інше" }
];

export const BASE_CATEGORIES: { value: ProductBaseCategory; label: string; slug: string }[] = [
  { value: "t-shirts", label: "Футболки", slug: "t-shirts" },
  { value: "sweatshirts", label: "Світшоти", slug: "sweatshirts" },
  { value: "hoodies", label: "Худі", slug: "hoodies" },
  { value: "basics", label: "Інші товари", slug: "basics" }
];

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Молочний", hex: "#F2F0EB" },
  { name: "Сірий", hex: "#8A8A8A" },
  { name: "Теракотовий", hex: "#B3402E" },
  { name: "Хакі", hex: "#2F3B2A" }
];

export function formatPrice(value: number): string {
  return `${value.toLocaleString("uk-UA")} ₴`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `CAS-${n}`;
}
