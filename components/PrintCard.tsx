import Image from "next/image";
import Link from "next/link";
import { Print } from "@/lib/types";

/**
 * Картка принта. Окремої сторінки принта немає, тому клік веде на каталог,
 * відфільтрований за категорією принта (або на пошук за назвою, якщо категорії нема).
 */
export default function PrintCard({ print }: { print: Print }) {
  const href = print.category
    ? `/catalog?printCategory=${encodeURIComponent(print.category)}`
    : `/search?q=${encodeURIComponent(print.name)}`;

  return (
    <Link href={href} className="group block bg-bgSoft">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={print.image}
          alt={print.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
        />
      </div>
      <div className="pt-4 pb-1">
        <p className="text-sm font-semibold mb-1">{print.name}</p>
        {print.category && <p className="text-[13px] text-muted">{print.category}</p>}
      </div>
    </Link>
  );
}
