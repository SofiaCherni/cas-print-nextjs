"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Не вдалося увійти.");
        return;
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Не вдалося звʼязатися з сервером.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="px-5 md:px-8 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h1 className="font-display font-extrabold text-2xl mb-6 text-center">АДМІНПАНЕЛЬ</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          autoFocus
          className="w-full bg-bgSoft border border-line px-4 py-3.5 text-sm mb-4"
        />
        {error && <p className="text-xs text-accent mb-4">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-accent text-paper text-sm font-bold tracking-wide rounded border border-accent hover:bg-paper hover:text-accent transition-colors duration-300 disabled:opacity-50"
        >
          {submitting ? "ВХІД…" : "УВІЙТИ"}
        </button>
      </form>
    </main>
  );
}
