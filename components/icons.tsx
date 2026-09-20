// Small inline line icons for the header (search / cart).
// No icon library dependency — plain SVG, inherits color via currentColor.
import type { SVGProps } from "react";

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="9" r="6.25" />
      <line x1="18" y1="18" x2="13.6" y2="13.6" />
    </svg>
  );
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5.5 7h9l0.7 10a1.5 1.5 0 0 1-1.5 1.6H6.3a1.5 1.5 0 0 1-1.5-1.6L5.5 7Z" />
      <path d="M7.3 7V5.6a2.7 2.7 0 0 1 5.4 0V7" />
    </svg>
  );
}
