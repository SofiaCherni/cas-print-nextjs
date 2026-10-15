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
  // Типи тканини, між якими обирає покупець у картці товару (лише футболки).
  // Якщо задано — розміри й кольори беруться з кожного типу окремо (див. FABRICS),
  // а sizesByFit/colors шаблону — лише об'єднання для сортування й сумісності.
  fabrics?: FabricKey[];
}

export type FabricKey = "standard" | "premium" | "oversize";

export interface FabricOption {
  key: FabricKey;
  /** Назва в картці товару, напр. «СТАНДАРТ». */
  label: string;
  /** Щільність, г/м². */
  gsm: number;
  /** Короткий опис під вибором тканини. */
  hint: string;
  sizesByFit: Partial<Record<Fit, string[]>>;
  /** Назви кольорів з COLOR_PALETTE. */
  colors: string[];
}

/** «СТАНДАРТ — 155 г/м²» */
export function fabricTitle(f: FabricOption): string {
  return `${f.label} — ${f.gsm} г/м²`;
}

const UNISEX_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];


/**
 * Типи тканини футболок. Щоб змінити розміри/кольори/опис конкретної тканини —
 * редагуй тут. Покупець обирає тканину в картці товару, після чого
 * розміри й кольори підтягуються саме для обраної тканини.
 */
export const FABRICS: Record<FabricKey, FabricOption> = {
  standard: {
    key: "standard",
    label: "СТАНДАРТ",
    gsm: 155,
    hint: "Легка та комфортна футболка для щоденного носіння.",
    sizesByFit: { unisex: UNISEX_SIZES, women: WOMEN_SIZES },
    colors: [
      "Пильно жовтий", "Білий", "Жовтий", "Червоний", "Сірий однотон", "Графіт", "Помаранчевий",
      "Ультрамарин", "Темно-синій", "Блакитний", "Ківі", "Зелений", "Хакі", "Сірий меланж",
      "Шоколад", "Фіолетовий", "Синій", "Кораловий", "Темно-зелений", "Чорний",
      "Глибокий темно-синій", "Лайм", "Марсал", "Білий меланж", "Рожевий", "Бежевий", "Джинс"
    ]
  },
  premium: {
    key: "premium",
    label: "ПРЕМІУМ",
    gsm: 185,
    hint: "Щільніша тканина, яка краще тримає форму та надає футболці дорожчого вигляду.",
    sizesByFit: { unisex: UNISEX_SIZES.slice(1), women: WOMEN_SIZES.slice(1) },
    colors: [
      "Чорний", "Темно-зелений", "Синій", "Сірий меланж", "Зелений", "Темно-синій",
      "Помаранчевий", "Графіт", "Сталевий", "Червоний", "Жовтий", "Білий"
    ]
  },
  oversize: {
    key: "oversize",
    label: "ОВЕРСАЙЗ",
    gsm: 240,
    hint: "Щільна преміальна тканина та вільний крій. ONE SIZE, рекомендовано на зріст до 180 см.",
    sizesByFit: { unisex: ["ONE SIZE"] },
    colors: ["Чорний", "Коричневий", "Графіт", "Білий", "Беж", "Рожевий", "Кемел", "Лимон", "Червоний"]
  }
};

/** Порядок показу тканин у картці товару. */
export const FABRIC_ORDER: FabricKey[] = ["standard", "premium", "oversize"];

function unionColors(keys: FabricKey[]): string[] {
  return Array.from(new Set(keys.flatMap((k) => FABRICS[k].colors)));
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    key: "tshirt-classic",
    label: "Футболка · Класичні",
    baseCategory: "t-shirts",
    cutStyle: "classic",
    description:
      "Футболка зі 100% бавовни. Покупець обирає тканину: Стандарт 155 г/м², Преміум 185 г/м² або Оверсайз 240 г/м².",
    sizesByFit: { unisex: UNISEX_SIZES, women: WOMEN_SIZES },
    sizeLabel: "РОЗМІР",
    fabrics: ["standard", "premium", "oversize"],
    colors: unionColors(["standard", "premium", "oversize"])
  },
  {
    key: "tshirt-oversize",
    label: "Футболка · Оверсайз",
    baseCategory: "t-shirts",
    cutStyle: "oversize",
    description:
      "Футболка зі 100% бавовни. Покупець обирає тканину: Стандарт 155 г/м², Преміум 185 г/м² або Оверсайз 240 г/м².",
    sizesByFit: { unisex: ["ONE SIZE"] },
    sizeLabel: "РОЗМІР",
    fabrics: ["standard", "premium", "oversize"],
    colors: unionColors(["standard", "premium", "oversize"])
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

// Старі ключі (до вибору тканини в картці): кожна щільність була окремим типом.
const LEGACY_TEMPLATE_KEYS: Record<string, { template: string; fabric: FabricKey }> = {
  "tshirt-standard": { template: "tshirt-classic", fabric: "standard" },
  "tshirt-premium": { template: "tshirt-classic", fabric: "premium" },
  "tshirt-oversize": { template: "tshirt-oversize", fabric: "oversize" }
};

export function getTemplate(key?: string | null): ProductTemplate | undefined {
  if (!key) return undefined;
  const resolved = LEGACY_TEMPLATE_KEYS[key]?.template ?? key;
  return PRODUCT_TEMPLATES.find((t) => t.key === resolved);
}

/** Тканина для товарів, створених за старими типами (щоб і в них показувалась щільність). */
export function legacyFabricFor(productType?: string | null): FabricKey | undefined {
  return productType ? LEGACY_TEMPLATE_KEYS[productType]?.fabric : undefined;
}

/**
 * Групи «ціна + кольори» для форми додавання товару: по одній на кожну тканину
 * або одна загальна (key = undefined), якщо в шаблону тканин немає.
 */
export interface TemplateGroup {
  key: FabricKey | undefined;
  title: string | null;
  sizesByFit: Partial<Record<Fit, string[]>>;
  colors: string[];
}

export function templateGroups(t: ProductTemplate): TemplateGroup[] {
  if (t.fabrics && t.fabrics.length > 0) {
    return t.fabrics.map((k) => ({
      key: k,
      title: fabricTitle(FABRICS[k]),
      sizesByFit: FABRICS[k].sizesByFit,
      colors: FABRICS[k].colors
    }));
  }
  return [{ key: undefined, title: null, sizesByFit: t.sizesByFit, colors: t.colors }];
}

/** Hex-коди для списку назв кольорів (назви, яких немає в палітрі, пропускаються). */
export function colorsByName(names: string[]): { name: string; hex: string }[] {
  return names
    .map((name) => COLOR_PALETTE.find((c) => c.name === name))
    .filter((c): c is { name: string; hex: string } => !!c);
}

/** Кольори шаблону з hex-кодами (назви, яких немає в палітрі, пропускаються). */
export function templateColors(t: ProductTemplate): { name: string; hex: string }[] {
  return t.colors
    .map((name) => COLOR_PALETTE.find((c) => c.name === name))
    .filter((c): c is { name: string; hex: string } => !!c);
}
