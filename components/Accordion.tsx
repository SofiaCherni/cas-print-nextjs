"use client";

import { useState } from "react";

export default function Accordion({
  items
}: {
  items: { title: string; content: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title} className="border-t border-line last:border-b">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between py-[18px] text-[13px] font-bold tracking-wide text-left"
            >
              {item.title}
              <span className={`text-base transition-transform ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && <p className="text-[13px] text-muted leading-relaxed pb-[18px]">{item.content}</p>}
          </div>
        );
      })}
    </div>
  );
}
