import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="НІЧОГО НЕ ЗНАЙДЕНО"
        description="Спробуйте змінити фільтри або переглянути весь каталог."
        ctaLabel="СКИНУТИ ФІЛЬТРИ"
        ctaHref="/catalog"
      />
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
