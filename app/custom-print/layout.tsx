import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Створити свій принт на футболці чи худі",
  description:
    "Завантаж своє фото, напис чи логотип — CAS-Print нанесе його на футболку, світшот або худі. Обери тканину, розмір і колір.",
  alternates: { canonical: "/custom-print" }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
