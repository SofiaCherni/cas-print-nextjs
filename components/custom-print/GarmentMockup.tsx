"use client";

import { useRef } from "react";

export type PrintFormat = "A6" | "A5" | "A4" | "A3";
export type Side = "front" | "back";

// Розмір області принта у координатах макета (viewBox 400×440). A4 ≈ 29×21 см → пропорція 1 : 1.41
export const FORMAT_BOX: Record<PrintFormat, { w: number; h: number }> = {
  A6: { w: 62, h: 88 },
  A5: { w: 88, h: 124 },
  A4: { w: 124, h: 175 },
  A3: { w: 175, h: 247 }
};
export const PRINT_TOP = 120; // верхній край області принта від коміра
export const VIEW_W = 400;
export const VIEW_H = 440;

function isDark(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

interface Props {
  garment: "t-shirt" | "sweatshirt" | "hoodie";
  side: Side;
  colorHex: string;
  printed: boolean;
  format: PrintFormat;
  imageUrl: string | null;
  text: string;
  /** Зсув принта від центру, у координатах макета. */
  offset: { x: number; y: number };
  onOffset: (o: { x: number; y: number }) => void;
}

export default function GarmentMockup({ garment, side, colorHex, printed, format, imageUrl, text, offset, onOffset }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const dark = isDark(colorHex);
  const ink = dark ? "#F2EEE8" : "#1a1a1a";
  const { w, h } = FORMAT_BOX[format];
  const long = garment !== "t-shirt";

  // Ліміти руху: принт не виходить за тулуб (x: 100…300).
  const limX = Math.max(0, (192 - w) / 2);
  const minY = 70 - PRINT_TOP;
  const maxY = 395 - (PRINT_TOP + h);
  const clamp = (o: { x: number; y: number }) => ({
    x: Math.max(-limX, Math.min(limX, o.x)),
    y: Math.max(minY, Math.min(maxY, o.y))
  });

  const x = 200 - w / 2 + offset.x;
  const y = PRINT_TOP + offset.y;

  function toSvg(e: React.PointerEvent) {
    const svg = svgRef.current!;
    const r = svg.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * VIEW_W, py: ((e.clientY - r.top) / r.height) * VIEW_H };
  }

  const neckY = side === "front" ? 92 : 62;
  const body = long
    ? `M140 40 L92 62 L46 270 L86 282 L104 170 L104 398 Q200 410 296 398 L296 170 L314 282 L354 270 L308 62 L260 40 Q200 ${neckY} 140 40 Z`
    : `M140 40 L92 62 L34 132 L70 168 L104 142 L104 398 Q200 410 296 398 L296 142 L330 168 L366 132 L308 62 L260 40 Q200 ${neckY} 140 40 Z`;
  const collar = `M140 40 Q200 ${neckY} 260 40`;

  const empty = !imageUrl && !text.trim();

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-full touch-none select-none"
      role="img"
      aria-label="Макет виробу"
    >
      <defs>
        <linearGradient id="shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <clipPath id="printClip">
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>

      <path d={body} fill={colorHex} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={body} fill="url(#shade)" />
      <path d={collar} fill="none" stroke={dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.25)"} strokeWidth="5" strokeLinecap="round" />

      {printed && (
        <g
          style={{ cursor: "grab" }}
          onPointerDown={(e) => {
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
            const p = toSvg(e);
            drag.current = { sx: p.px, sy: p.py, ox: offset.x, oy: offset.y };
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const p = toSvg(e);
            onOffset(clamp({ x: drag.current.ox + (p.px - drag.current.sx), y: drag.current.oy + (p.py - drag.current.sy) }));
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <rect x={x} y={y} width={w} height={h} fill="transparent" />
          {imageUrl && (
            <image href={imageUrl} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" clipPath="url(#printClip)" />
          )}
          {!imageUrl && text.trim() && (
            <text
              x={x + w / 2}
              y={y + h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={ink}
              fontFamily="var(--font-archivo), sans-serif"
              fontWeight="800"
              fontSize={Math.max(10, Math.min(34, (w * 1.6) / Math.max(4, text.trim().length)))}
            >
              {text.trim().slice(0, 40)}
            </text>
          )}
          <rect x={x} y={y} width={w} height={h} fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" />
          {empty && (
            <text x={x + w / 2} y={y + h / 2} textAnchor="middle" fill={ink} fillOpacity="0.55" fontSize="11" fontFamily="sans-serif">
              <tspan x={x + w / 2} dy="-0.2em">{format}</tspan>
              <tspan x={x + w / 2} dy="1.3em">ваша картинка</tspan>
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
