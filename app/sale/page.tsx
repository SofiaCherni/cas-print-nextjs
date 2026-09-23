import { getSaleProducts } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";

export const metadata = { title: "Sale — CAS-Print" };
export const dynamic = "force-dynamic";

/**
 * Reuses the Product.onSale flag (set from /admin/products when creating a
 * product) — no discount data is fabricated here. Empty until a product is
 * actually marked on sale.
 */
export default async function SalePage() {
  const saleProducts = await getSaleProducts();

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
