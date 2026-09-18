import { MetadataRoute } from "next";
import { PRODUCTS, BASE_CATEGORIES } from "@/lib/data";

const BASE_URL = "https://cas-print.example"; // TODO: NEED REAL BUSINESS DATA (production domain)

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalog",
    "/custom-print",
    "/delivery-and-payment",
    "/returns",
    "/size-guide"
  ].map((path) => ({ url: `${BASE_URL}${path}`, lastModified: new Date() }));

  const categoryRoutes = BASE_CATEGORIES.map((c) => ({
    url: `${BASE_URL}/catalog/${c.slug}`,
    lastModified: new Date()
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.createdAt)
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
