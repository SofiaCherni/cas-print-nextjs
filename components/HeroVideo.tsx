"use client";

import { useEffect, useState } from "react";

/**
 * Фонове відео головного екрана: вертикальне — для мобільних (до 767px),
 * горизонтальне — для компʼютерів. Файл обирається в браузері, тож телефон
 * не завантажує зайве велике відео. Поки вибір не зроблено — показується постер.
 */
const MOBILE = { src: "/assets/hero-mobile.mp4", poster: "/assets/poster-mobile.jpg" };
const DESKTOP = { src: "/assets/hero.mp4", poster: "/assets/poster.jpg" };

export default function HeroVideo() {
  const [media, setMedia] = useState<typeof DESKTOP | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMedia(mq.matches ? MOBILE : DESKTOP);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      key={media?.src ?? "initial"}
      autoPlay
      muted
      loop
      playsInline
      poster={media?.poster ?? DESKTOP.poster}
      className="absolute inset-0 w-full h-full object-cover"
    >
      {media && <source src={media.src} type="video/mp4" />}
    </video>
  );
}
