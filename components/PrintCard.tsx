import FadeImage from "./FadeImage";
import Link from "next/link";
import { Print } from "@/lib/types";

/**
 * Картка принта. Окремої сторінки принта немає, тому клік веде на каталог,
 * відфільтрований за категорією принта (або на пошук за назвою, якщо категорії нема).
 * На картці показується лише назва принта, без категорії.
 */
export default function PrintCard({ print }: { print: Print }) {
  const href = print.category
    ? `/catalog?printCategory=${encodeURIComponent(print.category)}`
    : `/search?q=${encodeURIComponent(print.name)}`;

  return (
    <Link href={href} className="group block bg-bgSoft">
      <div className="relative aspect-[3/4] overflow-hidden">
        <FadeImage
          src={print.image}
          alt={print.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
        />
        <div className="absolute left-0 right-0 -bottom-14 group-hover:bottom-0 transition-all duration-300 flex justify-center py-3.5 bg-accent/60 backdrop-blur-sm">
          <span className="text-xs font-bold tracking-wide">ПЕРЕГЛЯНУТИ</span>
        </div>
      </div>
      <div className="pt-4 pb-3">
        <p className="text-sm font-semibold">{print.name}</p>
        <span
          aria-hidden="true"
          className="block mt-3.5 h-[2px] w-10 bg-accent transition-[width,background-color] duration-[250ms] ease-out group-hover:w-16 group-hover:bg-accentHover"
        />
      </div>
    </Link>
  );
}
