import FadeImage from "./FadeImage";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import { productFromPrice } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
  const { price, old } = productFromPrice(product);
  return (
    <Link href={`/product/${product.slug}`} className="group block bg-bgSoft">
      <div className="relative aspect-[3/4] overflow-hidden">
        <FadeImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
        />
        {old !== null && (
          <span className="absolute left-0 top-3 bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide">
            SALE
          </span>
        )}
        <div className="absolute left-0 right-0 -bottom-14 group-hover:bottom-0 transition-all duration-300 flex justify-center py-3.5 bg-accent/60 backdrop-blur-sm">
          <span className="text-xs font-bold tracking-wide">ПЕРЕГЛЯНУТИ</span>
        </div>
      </div>
      <div className="pt-4 pb-3">
        <p className="text-sm font-semibold mb-1">{product.name}</p>
        <p className="text-[13px] text-paper">
          від{" "}
          {old !== null && <span className="line-through mr-2 text-[14px] text-paper">{formatPrice(old)}</span>}
          <span className={old !== null ? "text-[16px] text-[#A20D20] font-bold" : ""}>{formatPrice(price)}</span>
        </p>
        <span
          aria-hidden="true"
          className="block mt-3.5 h-[2px] w-10 bg-accent transition-[width,background-color] duration-[250ms] ease-out group-hover:w-16 group-hover:bg-accentHover"
        />
      </div>
    </Link>
  );
}
