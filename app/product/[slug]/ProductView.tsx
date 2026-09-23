"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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

export default function ProductView({ product }: { product: Product }) {
  const fits = Array.from(new Set(product.variants.map((v) => v.fit))) as Fit[];
  const sizes = Array.from(new Set(product.variants.map((v) => v.size))) as Size[];
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color.name, v.color])).values()
  );

  const [fit, setFit] = useState<Fit>(fits[0]);
  const [size, setSize] = useState<Size | null>("M");
  const [colorName, setColorName] = useState(colors[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const variant = useMemo(
    () => product.variants.find((v) => v.fit === fit && v.size === size && v.color.name === colorName),
    [product.variants, fit, size, colorName]
  );

  if (!product) return notFound();

  function handleAdd() {
    if (!variant) return;
    addItem(product.id, variant.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const accordionItems = [
    { title: "ОПИС", content: product.description },
    { title: "ХАРАКТЕРИСТИКИ", content: "Склад, щільність, країна виробництва — TODO: NEED REAL BUSINESS DATA." },
    { title: "ДОГЛЯД", content: "Рекомендації з прання та догляду — TODO: NEED REAL BUSINESS DATA." },
    { title: "РОЗМІРНА СІТКА", content: "Таблиця відповідності розмірів у см — див. сторінку «Розмірна сітка»." },
    { title: "ПАЛІТРА КОЛЬОРІВ", content: `Доступні кольори для цієї моделі: ${colors.map((c) => c.name).join(", ")}.` },
    { title: "ДОСТАВКА ТА ОПЛАТА", content: "Способи доставки й оплати — TODO: NEED REAL BUSINESS DATA." },
    { title: "ОБМІН ТА ПОВЕРНЕННЯ", content: "Умови обміну та повернення — TODO: NEED REAL BUSINESS DATA." }
  ];

  return (
    <main className="px-5 md:px-8">
      <div className="max-w-[1360px] mx-auto grid md:grid-cols-[1.2fr_1fr] gap-14 py-14 pb-28">
        <div>
          <div className="relative aspect-[4/5] mb-2.5 bg-bgSoft">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-bgSoft">
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display font-extrabold text-3xl mb-2">{product.name}</h1>
          <p className="text-lg mb-5">{formatPrice(variant?.price ?? product.basePrice)}</p>
          <p className="text-muted text-sm leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-7 mb-9">
            <SizeSelector sizes={sizes} selected={size} onSelect={setSize} />
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
