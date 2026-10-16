import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

// "Дашборд" removed from the nav per request — Товари, Принти and Замовлення.
// The /admin overview page itself still exists at its URL, just isn't linked
// here anymore.
// Адмінку не індексуємо; titles сторінок вже містять «Адмінпанель», тож суфікс не додаємо.
export const metadata: Metadata = {
  title: { default: "Адмінпанель — CAS-Print", template: "%s" },
  robots: { index: false, follow: false }
};

const ADMIN_NAV_ITEMS = [
  { label: "ТОВАРИ", href: "/admin/products" },
  { label: "ПРИНТИ", href: "/admin/prints" },
  { label: "ЗАМОВЛЕННЯ", href: "/admin/orders" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="px-5 md:px-8 pt-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <AdminNav items={ADMIN_NAV_ITEMS} />
          <AdminLogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
