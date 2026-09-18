import Link from "next/link";
import React from "react";

type Variant = "solid" | "ghost" | "accent";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: Variant;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold tracking-wide rounded border transition-colors";

const variants: Record<Variant, string> = {
  solid: "bg-paper text-bg border-paper hover:bg-accent hover:border-accent hover:text-paper",
  ghost: "bg-transparent text-paper border-paper/30 hover:border-paper",
  accent: "bg-accent text-paper border-accent hover:bg-transparent hover:text-accent"
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
