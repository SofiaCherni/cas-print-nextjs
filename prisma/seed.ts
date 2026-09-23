import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLORS = [
  { name: "Чорний", hex: "#0A0A0A" },
  { name: "Молочний", hex: "#F2F0EB" },
  { name: "Сірий", hex: "#8A8A8A" },
  { name: "Теракотовий", hex: "#B3402E" },
  { name: "Хакі", hex: "#2F3B2A" }
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

async function main() {
  console.log("Seeding prints…");

  const printSakura = await prisma.print.upsert({
    where: { id: "print-sakura" },
    update: {},
    create: {
      id: "print-sakura",
      name: "Сакура",
      category: "ANIME",
      image: "/assets/placeholder-print.svg",
      description: "Ілюстрація в аніме-стилі.",
      status: "active"
    }
  });
  const printZaraz = await prisma.print.upsert({
    where: { id: "print-zaraz-yak-dam" },
    update: {},
    create: {
      id: "print-zaraz-yak-dam",
      name: "Зараз як дам",
      category: "UKRAINIAN",
      image: "/assets/placeholder-print.svg",
      description: "Український принт із народним мотивом.",
      status: "active"
    }
  });
  const printMeme = await prisma.print.upsert({
    where: { id: "print-meme-oversize" },
    update: {},
    create: {
      id: "print-meme-oversize",
      name: "Оверсайз мем",
      category: "MEMES",
      image: "/assets/placeholder-print.svg",
      description: "Популярний мем-принт.",
      status: "active"
    }
  });
  const printText = await prisma.print.upsert({
    where: { id: "print-text-napys" },
    update: {},
    create: {
      id: "print-text-napys",
      name: "Напис",
      category: "TEXT",
      image: "/assets/placeholder-print.svg",
      description: "Типографічний принт.",
      status: "active"
    }
  });
  const printCartoon = await prisma.print.upsert({
    where: { id: "print-cartoon" },
    update: {},
    create: {
      id: "print-cartoon",
      name: "Мультфільм",
      category: "CARTOONS",
      image: "/assets/placeholder-print.svg",
      description: "Принт із мотивами мультфільму.",
      status: "active"
    }
  });
  const printMovie = await prisma.print.upsert({
    where: { id: "print-movie" },
    update: {},
    create: {
      id: "print-movie",
      name: "Кіно",
      category: "MOVIES",
      image: "/assets/placeholder-print.svg",
      description: "Кіно-принт.",
      status: "active"
    }
  });

  console.log("Seeding products…");

  const products = [
    {
      slug: "futbolka-sakura",
      name: "Футболка «Сакура»",
      description: "Пряма футболка щільністю 180 г/м² з принтом «Сакура». Бавовна 100%.",
      baseCategory: "T_SHIRTS" as const,
      printId: printSakura.id,
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
      printId: printSakura.id,
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
      printId: printZaraz.id,
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
      printId: printMeme.id,
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
      printId: printText.id,
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
      printId: printCartoon.id,
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
      printId: printMovie.id,
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
      printId: null,
      basePrice: 690,
      images: ["/assets/placeholder-product.svg", "/assets/placeholder-product.svg"],
      fits: ["UNISEX", "WOMEN"] as const,
      popular: true
    }
  ];

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
        printId: p.printId,
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
