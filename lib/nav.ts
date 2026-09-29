export interface DropdownItem {
  label: string;
  href: string;
  /** Optional second level — shown as a flyout to the right of the item on
   * desktop (only while that item is hovered/focused) and as indented links
   * under it in the mobile menu. */
  children?: DropdownItem[];
}

// Single source of truth for the two dropdown groups — shared by the
// desktop Header (NavDropdown) and MobileMenu so they never drift apart.
export const CATALOG_ITEMS: DropdownItem[] = [
  {
    label: "Футболки",
    href: "/catalog/t-shirts",
    children: [
      { label: "Класичні", href: "/catalog/t-shirts?cut=classic" },
      { label: "Оверсайз", href: "/catalog/t-shirts?cut=oversize" }
    ]
  },
  { label: "Світшоти", href: "/catalog/sweatshirts" },
  { label: "Худі", href: "/catalog/hoodies" },
  { label: "Інші товари", href: "/catalog/basics" }
];

export const BUYERS_ITEMS: DropdownItem[] = [
  { label: "Доставка та оплата", href: "/delivery-and-payment" },
  { label: "Обмін та повернення", href: "/returns" },
  { label: "Розмірна сітка", href: "/size-guide" }
];
