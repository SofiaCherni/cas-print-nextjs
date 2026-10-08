import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLORS = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Білий", hex: "#FFFFFF" },
  { name: "Сірий однотон", hex: "#9B9B9B" },
  { name: "Синій", hex: "#2255A4" },
  { name: "Бордо", hex: "#5C0A17" }
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

function makeVariants(basePrice: number, skuBase: string, fits: ("UNISEX" | "WOMEN")[]) {
  const variants = [];
  let i = 0;
  for (const fit of fits) {
    for (const size of SIZES) {
      for (const color of COLORS) {
        i++;
        const extended = size === "3XL" || size === "4XL" || size === "5XL";
        variants.push({
          size,
          fit,
          colorName: color.name,
          colorHex: color.hex,
          price: extended ? basePrice + 50 : basePrice,
          stockQty: 20,
          sku: `${skuBase}-${fit}-${size}-${i}`.toUpperCase()
        });
      }
    }
  }
  return variants;
}

// No printCategory set on any seed product — the admin creates her own
// categories from scratch via "Додати товар" (see lib/data.ts#getPrintCategories).
const products = [
  {
    slug: "futbolka-sakura",
    name: "Футболка «Сакура»",
    description: "Пряма футболка щільністю 180 г/м² з принтом «Сакура». Бавовна 100%.",
    baseCategory: "T_SHIRTS" as const,
    cutStyle: "CLASSIC" as const,
    basePrice: 890,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX", "WOMEN"] as const,
    popular: true
  },
  {
    slug: "hudi-sakura",
    name: "Худі «Сакура»",
    description: "Оверсайз худі з флісу 350 г/м² з принтом «Сакура».",
    baseCategory: "HOODIES" as const,
    cutStyle: undefined as "CLASSIC" | "OVERSIZE" | undefined,
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX"] as const,
    popular: false
  },
  {
    slug: "hudi-zaraz-yak-dam",
    name: "Худі «Зараз як дам»",
    description:
      "Оверсайз худі з щільного флісу 350 г/м². Принт на основі авторської ілюстрації в українській тематиці.",
    baseCategory: "HOODIES" as const,
    cutStyle: undefined as "CLASSIC" | "OVERSIZE" | undefined,
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX"] as const,
    popular: true
  },
  {
    slug: "futbolka-oversize-mem",
    name: "Футболка «Оверсайз мем»",
    description: "Оверсайзна футболка з популярним мем-принтом.",
    baseCategory: "T_SHIRTS" as const,
    cutStyle: "OVERSIZE" as const,
    basePrice: 890,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX", "WOMEN"] as const,
    popular: true
  },
  {
    slug: "hudi-napys",
    name: "Худі «Напис»",
    description: "Худі з типографічним принтом.",
    baseCategory: "HOODIES" as const,
    cutStyle: undefined as "CLASSIC" | "OVERSIZE" | undefined,
    basePrice: 1690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX"] as const,
    popular: false
  },
  {
    slug: "futbolka-multfilm",
    name: "Футболка «Мультфільм»",
    description: "Футболка з принтом у мотивах улюбленого мультфільму.",
    baseCategory: "T_SHIRTS" as const,
    cutStyle: "CLASSIC" as const,
    basePrice: 950,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX", "WOMEN"] as const,
    popular: true
  },
  {
    slug: "futbolka-kino",
    name: "Футболка «Кіно»",
    description: "Футболка з кіно-принтом.",
    baseCategory: "T_SHIRTS" as const,
    cutStyle: "OVERSIZE" as const,
    basePrice: 950,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX"] as const,
    popular: true
  },
  {
    slug: "futbolka-klasychna-chorna",
    name: "Футболка класична чорна",
    description: "Базова футболка без принту, щільність 180 г/м².",
    baseCategory: "BASICS" as const,
    cutStyle: undefined as "CLASSIC" | "OVERSIZE" | undefined,
    basePrice: 690,
    images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
    fits: ["UNISEX", "WOMEN"] as const,
    popular: true
  }
];

async function main() {
  console.log("Seeding products…");

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`  skip (exists): ${p.slug}`);
      continue;
    }
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        baseCategory: p.baseCategory,
        cutStyle: p.cutStyle,
        basePrice: p.basePrice,
        images: p.images,
        popular: p.popular,
        variants: { create: makeVariants(p.basePrice, p.slug, [...p.fits]) }
      }
    });
    console.log(`  created: ${p.slug}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
