import { Product, Variant } from "./types";

/**
 * Єдине місце, де визначається, скільки коштує варіант.
 * Використовується і на сторінках (показ ціни), і на сервері (кошик, замовлення),
 * тож ціна на екрані завжди збігається з ціною в замовленні.
 */
type PricedProduct = Pick<Product, "onSale" | "salePrice" | "basePrice">;

export function variantPrice(p: PricedProduct, v: Variant): number {
  if (!p.onSale) return v.price;
  if (typeof v.salePrice === "number" && v.salePrice > 0) return v.salePrice;
  // Старі акційні товари: знижка була одна на весь товар (basePrice → salePrice).
  if (p.salePrice && p.salePrice > 0 && p.salePrice < p.basePrice) {
    return Math.max(0, v.price - (p.basePrice - p.salePrice));
  }
  return v.price;
}

/** Стара (звичайна) ціна, якщо на варіант діє знижка; інакше null. */
export function variantOldPrice(p: PricedProduct, v: Variant): number | null {
  return variantPrice(p, v) < v.price ? v.price : null;
}

/** «Від» ціна для картки в каталозі: найдешевший варіант + його стара ціна. */
export function productFromPrice(p: Product): { price: number; old: number | null } {
  if (p.variants.length === 0) {
    const onSale = !!p.onSale && !!p.salePrice && p.salePrice < p.basePrice;
    return onSale ? { price: p.salePrice!, old: p.basePrice } : { price: p.basePrice, old: null };
  }
  let best = p.variants[0];
  for (const v of p.variants) if (variantPrice(p, v) < variantPrice(p, best)) best = v;
  return { price: variantPrice(p, best), old: variantOldPrice(p, best) };
}
