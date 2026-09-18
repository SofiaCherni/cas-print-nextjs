"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";
import QuantityStepper from "@/components/QuantityStepper";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeItem, phone, setPhone, comment, setComment } = useCart();

  return (
    <main className="px-5 md:px-8 py-14">
      <div className="max-w-[560px] mx-auto bg-bgSoft border border-line">
        <div className="flex justify-between items-center px-6 py-6 border-b border-line">
          <h1 className="font-display font-extrabold text-lg">КОШИК</h1>
          {lines.length > 0 && (
            <span className="text-[13px] text-muted">{lines.length} товари</span>
          )}
        </div>

        {lines.length === 0 ? (
          <EmptyState
            title="КОШИК ПОРОЖНІЙ"
            description="Час знайти щось своє."
            ctaLabel="ПЕРЕГЛЯНУТИ КАТАЛОГ"
            ctaHref="/catalog"
          />
        ) : (
          <>
            {lines.map(({ product, variant, quantity }) => (
              <div key={variant.id} className="grid grid-cols-[74px_1fr_auto] gap-4 px-6 py-5 border-b border-line">
                <div className="relative w-[74px] h-[92px] bg-bg">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{product.name}</p>
                  <p className="text-xs text-muted mb-2.5">
                    {variant.size} · {variant.fit === "unisex" ? "Унісекс" : "Жіночий"} · {variant.color.name}
                  </p>
                  <QuantityStepper
                    value={quantity}
                    onChange={(v) => updateQuantity(variant.id, v)}
                    small
                  />
                  <button
                    onClick={() => removeItem(variant.id)}
                    className="text-[11px] tracking-wide text-muted underline mt-2.5 block"
                  >
                    ВИДАЛИТИ
                  </button>
                </div>
                <div className="text-sm font-bold text-right">
                  {formatPrice(variant.price * quantity)}
                </div>
              </div>
            ))}
            <div className="px-6 py-5 border-b border-line">
              <label className="block text-xs tracking-wide text-muted font-bold mb-2">
                НОМЕР ТЕЛЕФОНУ
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+380"
                className="w-full bg-bg border border-line px-4 py-3 text-sm mb-4"
              />
              <label className="block text-xs tracking-wide text-muted font-bold mb-2">
                КОМЕНТАР ДО ЗАМОВЛЕННЯ
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Побажання щодо замовлення, зручний час для дзвінка тощо"
                rows={3}
                className="w-full bg-bg border border-line px-4 py-3 text-sm"
              />
            </div>
            <div className="flex justify-between px-6 py-6 font-display font-extrabold text-base">
              <span>РАЗОМ</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="px-6 pb-6">
              <Button href="/checkout" variant="accent" className="w-full py-[18px]">
                ОФОРМИТИ ЗАМОВЛЕННЯ
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
