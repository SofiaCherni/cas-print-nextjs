import CatalogView from "./CatalogView";

export const metadata = {
  title: "Каталог футболок, худі та світшотів з принтами",
  description:
    "Каталог CAS-Print: футболки, худі, світшоти та інші речі з готовими принтами. Обирай тканину, розмір і колір. Доставка Новою Поштою по Україні.",
  alternates: { canonical: "/catalog" }
};

export default function CatalogPage({
  searchParams
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return <CatalogView searchParams={searchParams} />;
}
