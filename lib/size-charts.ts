import { Fit, Product } from "./types";

/**
 * Розмірні сітки. Редагуй цифри тут.
 * Картинка: поклади файл у public/assets/size-guide/ з назвою <id>.jpg
 * (або .png / .webp) — сторінка підхопить її сама.
 */
export interface SizeChart {
  id: string;
  title: string;
  note?: string;
  columns: string[];
  rows: string[][];
}

export const SIZE_CHARTS: SizeChart[] = [
  {
    id: "tshirt-unisex",
    title: "ФУТБОЛКИ — УНІСЕКС (Стандарт і Преміум)",
    note: "Виміри в сантиметрах. Преміум — від розміру S.",
    columns: ["Розмір", "Ширина, см", "Довжина, см"],
    rows: [
      ["XS", "46", "68"],
      ["S", "50", "69"],
      ["M", "53", "71"],
      ["L", "56", "73"],
      ["XL", "59", "75"],
      ["XXL", "62", "77"],
      ["3XL", "65", "79"],
      ["4XL", "68", "82"]
    ]
  },
  {
    id: "tshirt-women",
    title: "ФУТБОЛКИ — ЖІНОЧА (Стандарт і Преміум)",
    note: "Виміри в сантиметрах. Преміум — від розміру S.",
    columns: ["Розмір", "Ширина, см", "Довжина, см"],
    rows: [
      ["XS", "41", "59"],
      ["S", "44", "61"],
      ["M", "47", "63"],
      ["L", "50", "65"],
      ["XL", "54", "67"],
      ["XXL", "58", "68"],
      ["3XL", "62", "74"]
    ]
  },
  {
    id: "tshirt-oversize",
    title: "ФУТБОЛКИ — ОВЕРСАЙЗ",
    note: "Один розмір (ONE SIZE), рекомендовано на зріст до 180 см.",
    columns: ["Розмір", "Ширина, см", "Довжина, см", "Рукав, см", "Ширина рукава, см"],
    rows: [["ONE SIZE", "66–68", "71", "25", "22"]]
  },
  {
    id: "sweatshirts",
    title: "СВІТШОТИ",
    note: "Виміри в сантиметрах.",
    columns: ["Розмір", "Ширина, см", "Довжина, см"],
    rows: [
      ["XS", "50", "67"],
      ["S", "52", "68"],
      ["M", "56", "71"],
      ["L", "60", "74"],
      ["XL", "64", "77"],
      ["XXL", "68", "80"]
    ]
  },
  {
    id: "hoodies",
    title: "ХУДІ (оверсайз, на флісі)",
    note: "Один розмір у двох довжинах. Допустима похибка ±2 см.",
    columns: ["Довжина", "Півобхват грудей, см", "Довжина виробу, см", "Рукав від шва, см"],
    rows: [
      ["Подовжене", "65", "75", "58"],
      ["Вкорочене", "65", "67", "44"]
    ]
  }
];

/** Якір на сторінці /size-guide для даного товару (null — сітки немає: подушка, кепка, шопер). */
export function sizeChartIdFor(product: Product, fit: Fit, fabric?: string | null): string | null {
  if (product.baseCategory === "t-shirts") {
    if (fabric ? fabric === "oversize" : product.cutStyle === "oversize") return "tshirt-oversize";
    return fit === "women" ? "tshirt-women" : "tshirt-unisex";
  }
  if (product.baseCategory === "sweatshirts") return "sweatshirts";
  if (product.baseCategory === "hoodies") return "hoodies";
  return null;
}
