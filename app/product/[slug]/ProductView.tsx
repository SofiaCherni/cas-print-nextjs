"use client";

import { useEffect, useMemo, useState } from "react";
import FadeImage from "@/components/FadeImage";
import { notFound } from "next/navigation";
import { Product, Size, Fit } from "@/lib/types";
import { formatPrice } from "@/lib/catalog-constants";
import SizeSelector from "@/components/SizeSelector";
import FitToggle from "@/components/FitToggle";
import ColorSwatches from "@/components/ColorSwatches";
import QuantityStepper from "@/components/QuantityStepper";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import { useCart } from "@/lib/cart-context";
import { FABRICS, FABRIC_ORDER, FabricKey, getTemplate } from "@/lib/product-templates";
import { variantPrice, variantOldPrice, productFromPrice } from "@/lib/pricing";
import FabricSelector from "@/components/FabricSelector";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import { sizeChartIdFor } from "@/lib/size-charts";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "ONE SIZE", "Подовжене", "Вкорочене"];
const sizeRank = (s: string) => {
  const i = SIZE_ORDER.indexOf(s);
  return i === -1 ? 999 : i;
};

export default function ProductView({ product }: { product: Product }) {
  const template = getTemplate(product.productType);

  // --- Тканина: СТАНДАРТ / ПРЕМІУМ / ОВЕРСАЙЗ (лише ті, що є у товару) ---
  const fabricKeys = FABRIC_ORDER.filter((k) => product.variants.some((v) => v.fabric === k));
  const [pickedFabric, setFabric] = useState<FabricKey | null>(null);
  const fabric: FabricKey | null =
    pickedFabric && fabricKeys.includes(pickedFabric) ? pickedFabric : fabricKeys[0] ?? null;

  // Усе нижче (фасон, розміри, кольори) береться лише з варіантів обраної тканини —
  // тож при зміні тканини розміри й кольори підтягуються самі.
  const fabricVariants = fabric ? product.variants.filter((v) => v.fabric === fabric) : product.variants;

  const fabricOptions = fabricKeys.map((k) => {
    const vs = product.variants.filter((v) => v.fabric === k);
    const best = vs.reduce((a, v) => (variantPrice(product, v) < variantPrice(product, a) ? v : a), vs[0]);
    return { key: k, price: variantPrice(product, best), oldPrice: variantOldPrice(product, best) };
  });

  const fits = Array.from(new Set(fabricVariants.map((v) => v.fit))) as Fit[];
  const [pickedFit, setFit] = useState<Fit | null>(null);
  const fit: Fit = pickedFit && fits.includes(pickedFit) ? pickedFit : fits[0];

  // Розміри залежать від тканини й фасону (напр. у преміум немає XS) і йдуть у зрозумілому порядку.
  const sizes = Array.from(new Set(fabricVariants.filter((v) => v.fit === fit).map((v) => v.size))).sort(
    (a, b) => sizeRank(a) - sizeRank(b)
  ) as Size[];
  const colorOrder = (fabric ? FABRICS[fabric].colors : template?.colors) ?? [];
  const colors = Array.from(
    new Map(fabricVariants.map((v) => [v.color.name, v.color])).values()
  ).sort((a, b) => {
    const ia = colorOrder.indexOf(a.name);
    const ib = colorOrder.indexOf(b.name);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const [pickedSize, setSize] = useState<Size | null>(null);
  // Якщо обраного розміру немає для цієї тканини/фасону — беремо M або перший доступний.
  const size: Size | null =
    pickedSize && sizes.includes(pickedSize) ? pickedSize : sizes.includes("M") ? "M" : sizes[0] ?? null;
  const [pickedColor, setColorName] = useState("");
  // Якщо обраного кольору немає для цієї тканини — беремо перший доступний.
  const colorName = colors.some((c) => c.name === pickedColor) ? pickedColor : colors[0]?.name ?? "";
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const variant = useMemo(
    () => fabricVariants.find((v) => v.fit === fit && v.size === size && v.color.name === colorName),
    [fabricVariants, fit, size, colorName]
  );

  // Подія «перегляд товару» — один раз на відкриття сторінки.
  useEffect(() => {
    if (!product) return;
    trackViewItem({ id: product.id, name: product.name, price: productFromPrice(product).price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) return notFound();

  function handleAdd() {
    if (!variant) return;
    addItem(product.id, variant.id, qty);
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: variantPrice(product, variant),
      quantity: qty,
      variant: [variant.fabric, variant.size, variant.color.name].filter(Boolean).join(" / ")
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const sizeLabel = template?.sizeLabel ?? "РОЗМІР";
  const guideId = sizeChartIdFor(product, fit, fabric);
  const fabricNote = fabric ? ` Тканина: ${FABRICS[fabric].label} — ${FABRICS[fabric].gsm} г/м².` : "";

  const accordionItems = [
    { title: "ОПИС", content: product.description + fabricNote },
    { title: "ХАРАКТЕРИСТИКИ", content: "Склад, щільність, країна виробництва — TODO: NEED REAL BUSINESS DATA." },
    { title: "ДОГЛЯД", content: "Рекомендації з прання та догляду — TODO: NEED REAL BUSINESS DATA." },
    { title: "РОЗМІРНА СІТКА", content: "Таблиця відповідності розмірів у см — див. сторінку «Розмірна сітка»." },
    { title: "ПАЛІТРА КОЛЬОРІВ", content: `Доступні кольори${fabric ? ` (${FABRICS[fabric].label})` : " для цієї моделі"}: ${colors.map((c) => c.name).join(", ")}.` },
    { title: "ОПЛАТА І ДОСТАВКА", content: "Оплата: повна оплата онлайн, оплата при отриманні (50% передплата), готівка або безготівковий розрахунок. Доставка тільки через Нову Пошту, термін 3–5 робочих днів, вартість за тарифами перевізника." },
    { title: "ОБМІН ТА ПОВЕРНЕННЯ", content: "Повернути або обміняти товар належної якості (невикористаний і неушкоджений) можна протягом 14 днів з дня покупки. Кошти повертаються за вирахуванням витрат на доставку товару покупцеві." }
  ];

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto grid md:grid-cols-[1.2fr_1fr] gap-14 py-14 pb-28">
        <div>
          <div className="relative aspect-[4/5] mb-2.5 bg-bgSoft">
            <FadeImage
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-bgSoft">
                <FadeImage
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 12vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display font-extrabold text-3xl mb-2">{product.name}</h1>
          {(() => {
            const price = variant ? variantPrice(product, variant) : product.basePrice;
            const old = variant ? variantOldPrice(product, variant) : null;
            return old !== null ? (
              <p className="text-lg mb-5 flex items-baseline gap-3">
                <span className="text-[#A20D20] line-through">{formatPrice(old)}</span>
                <span className="font-bold text-[#A20D20]">{formatPrice(price)}</span>
              </p>
            ) : (
              <p className="text-lg mb-5">{formatPrice(price)}</p>
            );
          })()}
          <p className="text-muted text-sm leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-7 mb-9">
            {fabric && (
              <FabricSelector options={fabricOptions} selected={fabric} onSelect={setFabric} />
            )}
            <SizeSelector sizes={sizes} selected={size} onSelect={setSize} label={sizeLabel} guideId={guideId} />
            {fits.length > 1 && <FitToggle options={fits} selected={fit} onSelect={setFit} />}
            <ColorSwatches colors={colors} selected={colorName} onSelect={setColorName} />
            <div>
              <span className="text-xs tracking-wide text-muted font-bold block mb-3">КІЛЬКІСТЬ</span>
              <QuantityStepper value={qty} onChange={setQty} />
            </div>
          </div>

          <Button
            onClick={handleAdd}
            variant="accent"
            className="w-full py-5"
            disabled={!variant}
          >
            {added ? "ДОДАНО ✓" : "ДОДАТИ ДО КОШИКА"}
          </Button>
          {!variant && (
            <p className="text-xs text-accent mt-2.5">Цей варіант тимчасово недоступний.</p>
          )}

          <div className="mt-10">
            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>
    </main>
  );
}
