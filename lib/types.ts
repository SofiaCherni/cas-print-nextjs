export type ProductBaseCategory = "t-shirts" | "sweatshirts" | "hoodies" | "basics";

export type PrintCategory =
  | "anime"
  | "text"
  | "memes"
  | "ukrainian"
  | "cartoons"
  | "movies"
  | "music"
  | "other";

export type Fit = "unisex" | "women";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL" | "5XL";

export const EXTENDED_SIZES: Size[] = ["3XL", "4XL", "5XL"];

export interface Print {
  id: string;
  name: string;
  category: PrintCategory;
  image: string;
  description: string;
  status: "active" | "hidden";
  availableProductIds: string[];
}

export interface Variant {
  id: string;
  size: Size;
  fit: Fit;
  color: { name: string; hex: string };
  price: number;
  stockQty: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  baseCategory: ProductBaseCategory;
  printId: string | null;
  basePrice: number;
  // TODO: NEED REAL BUSINESS DATA — mark real sale items as onSale: true
  // (and set salePrice) once CAS-Print confirms which products/discounts
  // apply. Left unset for all current mock products on purpose.
  onSale?: boolean;
  salePrice?: number;
  images: string[];
  variants: Variant[];
  popular?: boolean;
  status?: "active" | "hidden";
  createdAt: string;
}

export interface CartLineItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderStatus {
  code:
    | "NEW"
    | "CONFIRMED"
    | "PAID"
    | "PROCESSING"
    | "READY"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  label: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus["code"], string> = {
  NEW: "Нове замовлення",
  CONFIRMED: "Підтверджено",
  PAID: "Оплачено",
  PROCESSING: "У виробництві",
  READY: "Готове до відправки",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
  RETURNED: "Повернуто"
};
