import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";

export default function ProductCard({
  product,
  tone = "default"
}: {
  product: Product;
  tone?: "default" | "accent";
}) {
  const accent = tone === "accent";
  return (
    <Link href={`/product/${product.slug}`} className={`group block ${accent ? "bg-accent" : "bg-bgSoft"}`}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
        />
        <div className="absolute left-0 right-0 -bottom-14 group-hover:bottom-0 transition-all duration-300 flex justify-center py-3.5 bg-bg/55 backdrop-blur-sm">
          <span className="text-xs font-bold tracking-wide">ПЕРЕГЛЯНУТИ</span>
        </div>
      </div>
      <div className={accent ? "p-4" : "pt-4 pb-1"}>
        <p className="text-sm font-semibold mb-1">{product.name}</p>
        <p className={`text-[13px] ${accent ? "text-paper/80" : "text-muted"}`}>від {formatPrice(product.basePrice)}</p>
      </div>
    </Link>
  );
}
