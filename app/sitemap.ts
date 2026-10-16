import { MetadataRoute } from "next";
import { getAllProductSlugs, BASE_CATEGORIES } from "@/lib/data";
import { SITE_URL } from "@/lib/site-config";

const BASE_URL = SITE_URL; // домен задається в lib/site-config.ts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/catalog",
    "/prints",
    "/custom-print",
    "/sale",
    "/delivery-and-payment",
    "/returns",
    "/size-guide",
    "/contacts",
    "/privacy"
  ].map((path) => ({ url: `${BASE_URL}${path}`, lastModified: new Date() }));

  const categoryRoutes = BASE_CATEGORIES.map((c) => ({
    url: `${BASE_URL}/catalog/${c.slug}`,
    lastModified: new Date()
  }));

  const products = await getAllProductSlugs();
  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.createdAt
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
