import CatalogView from "./CatalogView";

export const metadata = {
  title: "Каталог — CAS-Print",
  description: "Футболки, худі та базові речі з готовими принтами від CAS-Print."
};

export default function CatalogPage({
  searchParams
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return <CatalogView searchParams={searchParams} />;
}
