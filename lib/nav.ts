export interface DropdownItem {
  label: string;
  href: string;
}

// Single source of truth for the two dropdown groups — shared by the
// desktop Header (NavDropdown) and MobileMenu so they never drift apart.
export const CATALOG_ITEMS: DropdownItem[] = [
  { label: "Футболки", href: "/catalog/t-shirts" },
  { label: "Світшоти", href: "/catalog/sweatshirts" },
  { label: "Худі", href: "/catalog/hoodies" },
  { label: "Інші товари", href: "/catalog/basics" }
];

export const BUYERS_ITEMS: DropdownItem[] = [
  { label: "Доставка", href: "/delivery-and-payment#delivery" },
  { label: "Оплата", href: "/delivery-and-payment#payment" },
  { label: "Обмін і повернення", href: "/returns" },
  { label: "Контакти", href: "/contacts" }
];
