"use client";

import { useState } from "react";

const EXTENSIONS = ["jpg", "png", "webp"];

/**
 * Показує /assets/size-guide/<id>.(jpg|png|webp). Якщо файлу ще немає —
 * тихо показує напис-заглушку замість зламаної картинки.
 */
export default function SizeChartImage({ id, alt }: { id: string; alt: string }) {
  const [extIndex, setExtIndex] = useState(0);

  if (extIndex >= EXTENSIONS.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-muted p-4 text-center">
        Зображення розмірної сітки скоро зʼявиться
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={extIndex}
      src={`/assets/size-guide/${id}.${EXTENSIONS[extIndex]}`}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-contain"
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}
