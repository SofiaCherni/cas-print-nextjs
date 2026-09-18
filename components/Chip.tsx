import React from "react";

export default function Chip({
  active,
  children,
  onClick
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
        active
          ? "bg-paper text-bg border-paper"
          : "text-muted border-line hover:text-paper hover:border-paper"
      }`}
    >
      {children}
    </button>
  );
}
