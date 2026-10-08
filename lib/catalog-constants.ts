import { ProductBaseCategory } from "./types";

/**
 * Pure, DB-free constants and helpers. Deliberately kept out of lib/data.ts
 * (which now imports the Prisma client) so client components can import
 * these directly without pulling Prisma into the browser bundle.
 *
 * Print categories are NOT listed here anymore — they're free text the
 * admin creates herself in "Додати товар" (see lib/data.ts#getPrintCategories,
 * which derives the current list from whatever products already use).
 */

export const BASE_CATEGORIES: { value: ProductBaseCategory; label: string; slug: string }[] = [
  { value: "t-shirts", label: "Футболки", slug: "t-shirts" },
  { value: "sweatshirts", label: "Світшоти", slug: "sweatshirts" },
  { value: "hoodies", label: "Худі", slug: "hoodies" },
  { value: "basics", label: "Інші товари", slug: "basics" }
];

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Пильно жовтий", hex: "#CBB26A" },
  { name: "Білий", hex: "#FFFFFF" },
  { name: "Жовтий", hex: "#F5D000" },
  { name: "Червоний", hex: "#D0021B" },
  { name: "Сірий однотон", hex: "#9B9B9B" },
  { name: "Графіт", hex: "#4A4A4A" },
  { name: "Помаранчевий", hex: "#F5821F" },
  { name: "Ультрамарин", hex: "#3F51B5" },
  { name: "Темно-синій", hex: "#1B2A4A" },
  { name: "Блакитний", hex: "#7EC8E3" },
  { name: "Ківі", hex: "#8DC63F" },
  { name: "Зелений", hex: "#2E8B33" },
  { name: "Хакі", hex: "#707B4A" },
  { name: "Сірий меланж", hex: "#ADA9A0" },
  { name: "Шоколад", hex: "#4B3621" },
  { name: "Фіолетовий", hex: "#6A0DAD" },
  { name: "Синій", hex: "#2255A4" },
  { name: "Кораловий", hex: "#FF7F66" },
  { name: "Темно-зелений", hex: "#1F4620" },
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Глибокий темно-синій", hex: "#0B1930" },
  { name: "Лайм", hex: "#B4E600" },
  { name: "Марсал", hex: "#6F2232" },
  { name: "Білий меланж", hex: "#EDEBE6" },
  { name: "Рожевий", hex: "#F28FB2" },
  { name: "Бежевий", hex: "#E8DCC5" },
  { name: "Джинс", hex: "#46647A" },
  { name: "Сталевий", hex: "#71797E" },
  { name: "Бордо", hex: "#5C0A17" }
];

export function formatPrice(value: number): string {
  return `${value.toLocaleString("uk-UA")} ₴`;
}

export function generateOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `CAS-${n}`;
}
