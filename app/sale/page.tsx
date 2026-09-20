import { PRODUCTS } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

export const metadata = { title: "Sale — CAS-Print" };

/**
 * Reuses the existing Product.onSale flag (see lib/types.ts) — no discount
 * data is fabricated here. Until real sale items are marked in lib/data.ts,
 * this page shows the same "nothing found" empty state as an empty catalog
 * filter, with a link back to the full catalog.
 * TODO: NEED REAL BUSINESS DATA — which products, what discount.
 */
export default function SalePage() {
  const saleProducts = PRODUCTS.filter((p) => p.onSale);

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto py-14 pb-28">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-3">
          SALE
        </h1>
        <p className="text-muted text-sm mb-10">
          {saleProducts.length > 0
            ? "Товари з тимчасовою знижкою."
            : "Наразі акційних товарів немає — заходьте пізніше."}
        </p>
        <ProductGrid products={saleProducts} />
      </div>
    </main>
  );
}
