// ============================================================================
//  НАЛАШТУВАННЯ САЙТУ — ТУТ ВСТАВЛЯЄШ СВОЇ ДАНІ (коди, домен, контакти)
// ============================================================================

// 1) ДОМЕН САЙТУ (без "/" в кінці). Використовується в SEO: canonical, sitemap, Open Graph.
//    Заміни на свій реальний домен, коли він буде готовий.
// Якщо домен не вказано, беремо адресу, яку Vercel підставляє сам (основний домен проєкту),
// тож canonical/sitemap ніколи не вказують на неіснуючий сайт.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : "https://cas-print.example")
).replace(/\/+$/, "");

// 2) КОДИ АНАЛІТИКИ ТА РЕКЛАМИ — встав свої значення між лапками.
//    Порожній рядок "" = цей інструмент вимкнено (нічого не завантажується).
export const TRACKING = {
  // Google Analytics 4: «Адмін» → «Потоки даних» → Measurement ID. Виглядає як G-XXXXXXXXXX
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",

  // Google Ads: ID облікового запису для тегу. Виглядає як AW-XXXXXXXXXX
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  // Google Ads: мітка конверсії «Покупка» (друга частина після "/" у send_to: AW-XXXXXXXXXX/ТУТ_МІТКА)
  googleAdsPurchaseLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL || "",
  // Google Ads: мітка конверсії «Заявка на власний принт» (необов'язково)
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",

  // Meta Pixel (Facebook/Instagram): Events Manager → Pixel ID, 15–16 цифр
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",

  // Підтвердження домену в Google Search Console (значення з мета-тегу google-site-verification)
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  // Підтвердження домену в Meta Business (значення з мета-тегу facebook-domain-verification)
  facebookDomainVerification: process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION || ""
};

export const TRACKING_ENABLED = !!(TRACKING.gaId || TRACKING.googleAdsId || TRACKING.metaPixelId);

// 3) ЗАГАЛЬНІ ДАНІ САЙТУ
export const SITE_NAME = "CAS-Print";
export const SITE_TITLE = "CAS-Print — одяг, який говорить за тебе";
export const SITE_DESCRIPTION =
  "Футболки, худі та світшоти з готовими принтами або власним дизайном. Український streetwear-бренд CAS-Print. Доставка Новою Поштою по Україні.";
// Картинка для прев'ю посилання в соцмережах/месенджерах (ідеально 1200×630 px). Лежить у public/.
export const DEFAULT_OG_IMAGE = "/assets/poster.jpg";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Посилання на соцмережі магазину — змінюються тут і підхоплюються скрізь (підвал, контакти).
export const SOCIALS = {
  instagram: { label: "Instagram", handle: "@cas_print", url: "https://www.instagram.com/cas_print/" },
  telegram: { label: "Telegram", handle: "@casprint", url: "https://t.me/casprint" }
};

// Дані власника сайту для політики конфіденційності — ЗАПОВНИ СВОЇМИ перед запуском.
export const SELLER = {
  name: "[вкажіть: ПІБ ФОП або назву компанії]",
  email: "[вкажіть email для звернень]",
  updated: "16.10.2026"
};
