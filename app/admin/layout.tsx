import ElectricNav from "@/components/admin/ElectricNav";

// Existing labels/routes only — matches the titles already used on the
// admin dashboard cards (app/admin/page.tsx) and the actual page routes.
const ADMIN_NAV_ITEMS = [
  { label: "ДАШБОРД", href: "/admin" },
  { label: "ТОВАРИ", href: "/admin/products" },
  { label: "ЗАМОВЛЕННЯ", href: "/admin/orders" }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="px-5 md:px-8 pt-8">
        <div className="max-w-4xl mx-auto">
          <ElectricNav items={ADMIN_NAV_ITEMS} />
        </div>
      </div>
      {children}
    </div>
  );
}
