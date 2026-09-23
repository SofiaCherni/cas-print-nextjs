"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductRowActions({
  id,
  status
}: {
  id: string;
  status: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function toggleStatus() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "active" ? "hidden" : "active" })
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Видалити цей товар назавжди? Дію не можна скасувати.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={toggleStatus} disabled={busy} className="text-xs underline text-muted mr-3 disabled:opacity-50">
        {status === "active" ? "Приховати" : "Показати"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs underline text-accent disabled:opacity-50">
        Видалити
      </button>
    </>
  );
}
