import { COLOR_PALETTE } from "./catalog-constants";
import { CutStyle, Fit, ProductBaseCategory } from "./types";

/**
 * Шаблони типів виробів. В адмінці обираєш тип — розміри, кольори й
 * початковий опис підставляються самі. Щоб щось змінити (додати колір,
 * розмір, поправити опис) — редагуй цей файл.
 *
 * Назви кольорів мають збігатися з назвами в COLOR_PALETTE
 * (lib/catalog-constants.ts) — там же лежать їхні hex-коди.
 * Нові товари створюються за цими шаблонами; вже створені не змінюються.
 */

export interface ProductTemplate {
  key: string;
  label: string;
  baseCategory: ProductBaseCategory;
  cutStyle?: CutStyle;
  description: string;
  // Для кожного фасону — свій набір розмірів. Один ключ = один фасон (вибору фасону немає).
  sizesByFit: Partial<Record<Fit, string[]>>;
  // Назви кольорів з COLOR_PALETTE.
  colors: string[];
  // Підпис вибору в картці товару: «РОЗМІР» або «ДОВЖИНА» (для худі).
  sizeLabel: string;
}

const UNISEX_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    key: "tshirt-standard",
    label: "Футболка · Стандарт (155 г/м²)",
    baseCategory: "t-shirts",
    cutStyle: "classic",
    description:
      "Футболка зі 100% бавовни, щільність 155 г/м². Легка та комфортна футболка для щоденного носіння. Два крої: унісекс та жіночий.",
    sizesByFit: { unisex: UNISEX_SIZES, women: WOMEN_SIZES },
    sizeLabel: "РОЗМІР",
    colors: [
      "Пильно жовтий", "Білий", "Жовтий", "Червоний", "Сірий однотон", "Графіт", "Помаранчевий",
      "Ультрамарин", "Темно-синій", "Блакитний", "Ківі", "Зелений", "Хакі", "Сірий меланж",
      "Шоколад", "Фіолетовий", "Синій", "Кораловий", "Темно-зелений", "Чорний",
      "Глибокий темно-синій", "Лайм", "Марсал", "Білий меланж", "Рожевий", "Бежевий", "Джинс"
    ]
  },
  {
    key: "tshirt-premium",
    label: "Футболка · Преміум (185 г/м²)",
    baseCategory: "t-shirts",
    cutStyle: "classic",
    description:
      "Футболка зі 100% бавовни, щільність 185 г/м². Щільніша тканина, яка краще тримає форму та надає футболці дорожчого вигляду. Два крої: унісекс та жіночий.",
    sizesByFit: { unisex: UNISEX_SIZES.slice(1), women: WOMEN_SIZES.slice(1) },
    sizeLabel: "РОЗМІР",
    colors: [
      "Чорний", "Темно-зелений", "Синій", "Сірий меланж", "Зелений", "Темно-синій",
      "Помаранчевий", "Графіт", "Сталевий", "Червоний", "Жовтий", "Білий"
    ]
  },
  {
    key: "tshirt-oversize",
    label: "Футболка · Оверсайз (240 г/м²)",
    baseCategory: "t-shirts",
    cutStyle: "oversize",
    description:
      "Футболка зі 100% бавовни, щільність 240 г/м². Щільна преміальна тканина та вільний крій для розслаблених, стильних образів. Розмір: ONE SIZE, рекомендовано на зріст до 180 см.",
    sizesByFit: { unisex: ["ONE SIZE"] },
    sizeLabel: "РОЗМІР",
    colors: ["Чорний", "Коричневий", "Графіт", "Білий", "Беж", "Рожевий", "Кемел", "Лимон", "Червоний"]
  },
  {
    key: "sweatshirt",
    label: "Світшот",
    baseCategory: "sweatshirts",
    description: "Світшот з принтом.",
    sizesByFit: { unisex: ["XS", "S", "M", "L", "XL", "XXL"] },
    sizeLabel: "РОЗМІР",
    colors: [
      "Білий", "Рожевий", "Чорний", "Хакі", "Темно-зелений", "Червоний", "Сірий меланж", "Зелений",
      "Ківі", "Темно-синій", "Бежевий", "Олива", "Помаранчевий", "Фіолетовий", "Синій",
      "Вишневий", "Графіт", "Жовтий"
    ]
  },
  {
    key: "hoodie",
    label: "Худі (на флісі, оверсайз)",
    baseCategory: "hoodies",
    description:
      "Худі на флісі, оверсайз, один розмір. Подовжене: півобхват грудей 65 см, довжина 75 см, рукав від шва 58 см. Вкорочене: півобхват грудей 65 см, довжина 67 см, рукав від шва 44 см. Допустима похибка ±2 см.",
    sizesByFit: { unisex: ["Подовжене", "Вкорочене"] },
    sizeLabel: "ДОВЖИНА",
    colors: [
      "Бордо", "Шоколад", "Шавлія", "Бірюза", "Червоний", "Чорний", "Графіт", "Хакі", "Білий",
      "Блакитний", "Лаванда", "Світло-сірий", "Рожевий", "Молочний", "Фіолетовий", "Бежевий"
    ]
  },
  {
    key: "pillow",
    label: "Подушка",
    baseCategory: "basics",
    description: "Подушка з принтом. Розмір: M (38×38 см).",
    sizesByFit: { unisex: ["M (38×38 см)"] },
    sizeLabel: "РОЗМІР",
    colors: ["Червоний", "Коричневий", "Темно-зелений", "Сірий"]
  },
  {
    key: "cap",
    label: "Кепка",
    baseCategory: "basics",
    description: "Кепка з принтом. Розмір: One Size, 56–60 см.",
    sizesByFit: { unisex: ["One Size"] },
    sizeLabel: "РОЗМІР",
    colors: [
      "Беж", "Хакі", "Коричневий", "Сірий", "Білий", "Графіт", "Темно-синій", "Темно-зелений",
      "М'ята", "Блакитний", "Бірюзово-синій", "Синій", "Фіолетовий", "Ніжно-рожевий",
      "Персиковий", "Гірчичний", "Рожевий", "Марсал", "Червоний"
    ]
  },
  {
    key: "shopper",
    label: "Шопер",
    baseCategory: "basics",
    description: "Шопер з принтом. Розмір: 38×42 см, ручки 70 см.",
    sizesByFit: { unisex: ["38×42 см"] },
    sizeLabel: "РОЗМІР",
    colors: ["Червоний", "Синій", "Білий", "Сірий"]
  }
];

export function getTemplate(key?: string | null): ProductTemplate | undefined {
  return key ? PRODUCT_TEMPLATES.find((t) => t.key === key) : undefined;
}

/** Кольори шаблону з hex-кодами (назви, яких немає в палітрі, пропускаються). */
export function templateColors(t: ProductTemplate): { name: string; hex: string }[] {
  return t.colors
    .map((name) => COLOR_PALETTE.find((c) => c.name === name))
    .filter((c): c is { name: string; hex: string } => !!c);
}
