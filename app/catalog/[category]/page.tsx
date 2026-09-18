import { notFound } from "next/navigation";
import CatalogView from "../CatalogView";
import { BASE_CATEGORIES } from "@/lib/data";

export function generateStaticParams() {
  return BASE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = BASE_CATEGORIES.find((c) => c.slug === params.category);
  return { title: cat ? `${cat.label} — CAS-Print` : "Каталог — CAS-Print" };
}

export default function CategoryPage({
  params,
  searchParams
}: {
  params: { category: string };
  searchParams: Record<string, string | undefined>;
}) {
  const cat = BASE_CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) notFound();
  return <CatalogView baseCategory={cat.value} searchParams={searchParams} />;
}
