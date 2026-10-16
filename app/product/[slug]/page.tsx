import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductView from "./ProductView";
import { productFromPrice, variantPrice } from "@/lib/pricing";
import { SITE_NAME, absoluteUrl } from "@/lib/site-config";

// Без generateStaticParams: товари беруться з бази й додаються через /admin —
// сторінки створюються на вимогу, без перебудови сайту.
// Сторінка товару кешується на 60 с (швидке відкриття). Після змін в адмінці кеш скидається одразу.
export const revalidate = 60;

function shortDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Товар не знайдено", robots: { index: false, follow: false } };

  const { price, old } = productFromPrice(product);
  // Ціна йде на початку, щоб її не обрізало в сніпеті Google.
  const description = shortDescription(
    `${product.name} від ${price} ₴${old ? " (акція)" : ""}. ${product.description}`
  );
  const image = product.images[0];
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${SITE_NAME}`,
      description,
      url: `/product/${product.slug}`,
      images: image ? [{ url: absoluteUrl(image), alt: product.name }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE_NAME}`,
      description,
      images: image ? [absoluteUrl(image)] : undefined
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Product schema.org structured data: діапазон цін по всіх варіантах (тканини/розміри) з урахуванням акції.
  const prices = product.variants.map((v) => variantPrice(product, v));
  const lowPrice = prices.length ? Math.min(...prices) : product.basePrice;
  const highPrice = prices.length ? Math.max(...prices) : product.basePrice;
  const inStock = product.variants.some((v) => v.stockQty > 0);
  const url = absoluteUrl(`/product/${product.slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images.map(absoluteUrl),
      sku: product.slug,
      brand: { "@type": "Brand", name: SITE_NAME },
      url,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "UAH",
        lowPrice,
        highPrice,
        offerCount: product.variants.length || 1,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        url
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Головна", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog") },
        { "@type": "ListItem", position: 3, name: product.name, item: url }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView product={product} />
    </>
  );
}
