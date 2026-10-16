import { notFound } from "next/navigation";
import CatalogView from "../CatalogView";
import { BASE_CATEGORIES } from "@/lib/data";

export function generateStaticParams() {
  return BASE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = BASE_CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) return { title: "Каталог", robots: { index: false, follow: true } };
  return {
    title: `${cat.label} з принтами — купити`,
    description: `${cat.label} з принтами від CAS-Print: готові дизайни та власний принт. Обирай розмір і колір, доставка Новою Поштою по Україні.`,
    // Фільтри в адресі (?color=…) не створюють дублів у пошуку — canonical завжди чиста адреса розділу.
    alternates: { canonical: `/catalog/${cat.slug}` }
  };
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
