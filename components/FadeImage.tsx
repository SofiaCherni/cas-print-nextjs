"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * next/image з плавною появою: поки фото вантажиться — мерехтливий скелетон,
 * потім воно «проявляється» (з легким розмиттям). Працює лише з `fill`,
 * тож батьківський блок має бути position: relative (як і раніше).
 */
export default function FadeImage({ className = "", onLoad, ...props }: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Фото могло завантажитись ще до гідрації — тоді onLoad уже не спрацює.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span aria-hidden="true" className="skeleton absolute inset-0" />}
      <Image
        ref={ref}
        {...props}
        className={`img-fade ${loaded ? "is-loaded" : ""} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
