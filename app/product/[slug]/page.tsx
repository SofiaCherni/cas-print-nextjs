import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductView from "./ProductView";

// No generateStaticParams: products now come from the database and can be
// added anytime through /admin — pages render on-demand per slug instead of
// needing a rebuild for every new product.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return {
    title: product ? `${product.name} — CAS-Print` : "Товар — CAS-Print",
    description: product?.description
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  // Product schema.org structured data (brief section 31).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "UAH",
      price: product.basePrice,
      availability: "https://schema.org/InStock"
    }
  };

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
