"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrintRowActions({
  id,
  status,
  showOnHome
}: {
  id: string;
  status: string;
  showOnHome: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/prints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Видалити цей принт назавжди? Дію не можна скасувати.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/prints/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => patch({ showOnHome: !showOnHome })}
        disabled={busy}
        className="text-xs underline text-muted mr-3 disabled:opacity-50"
      >
        {showOnHome ? "Прибрати з головної" : "Показувати на головній"}
      </button>
      <button
        onClick={() => patch({ status: status === "active" ? "hidden" : "active" })}
        disabled={busy}
        className="text-xs underline text-muted mr-3 disabled:opacity-50"
      >
        {status === "active" ? "Приховати" : "Показати"}
      </button>
      <button onClick={remove} disabled={busy} className="text-xs underline text-accent disabled:opacity-50">
        Видалити
      </button>
    </>
  );
}
