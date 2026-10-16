import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";
import {
  DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, SOCIALS, TRACKING, absoluteUrl
} from "@/lib/site-config";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Назва сторінки + " — CAS-Print" додається автоматично, тож у самих сторінках суфікс не пишемо.
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["футболки з принтом", "худі з принтом", "світшоти", "власний принт", "streetwear", "одяг з принтами", "CAS-Print"],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 }
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_TITLE }]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE]
  },
  icons: { icon: "/assets/logo.png", apple: "/assets/logo.png" },
  // Підтвердження домену в Google Search Console та Meta Business — значення в lib/site-config.ts
  verification: TRACKING.googleSiteVerification ? { google: TRACKING.googleSiteVerification } : undefined,
  other: TRACKING.facebookDomainVerification
    ? { "facebook-domain-verification": TRACKING.facebookDomainVerification }
    : undefined
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808"
};

// Структуровані дані для Google: організація та пошук по сайту.
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/assets/logo.png"),
    sameAs: Object.values(SOCIALS).map((s) => s.url)
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "uk-UA",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${archivo.variable} ${manrope.variable}`}>
      <body className="font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {/* Без JavaScript показуємо контент одразу, без анімацій появи */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}.img-fade{opacity:1!important}"}</style>
        </noscript>
        <Analytics />
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
