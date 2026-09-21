import Link from "next/link";
import React from "react";

type Variant = "solid" | "ghost" | "accent" | "accentGhost";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: Variant;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold tracking-wide rounded border transition-colors duration-300";

const variants: Record<Variant, string> = {
  solid: "bg-paper text-bg border-paper hover:bg-accentHover hover:border-accentHover hover:text-paper",
  ghost: "bg-transparent text-paper border-paper/30 hover:border-paper",
  // Primary CTA everywhere on the site (hero, add to cart, checkout, custom
  // print submit) — true invert on hover, not just a lighter shade.
  accent: "bg-accent text-paper border-accent hover:bg-paper hover:text-accent hover:border-accent",
  // Secondary CTA paired with `accent` (e.g. hero's "СТВОРИ СВІЙ"). Neutral
  // in its normal state (blends with the "ghost" look already used
  // elsewhere) — the burgundy only appears on hover, as an invert.
  accentGhost: "bg-transparent text-paper border-paper/40 hover:bg-paper hover:text-accent hover:border-accent"
};

export default function Button({ href, variant = "solid", className = "", children, ...rest }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
