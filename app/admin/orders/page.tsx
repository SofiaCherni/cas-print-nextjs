import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/data";

export const metadata = { title: "Замовлення — Адмінпанель CAS-Print" };
export const dynamic = "force-dynamic"; // always show latest orders, never cache

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  let dbError = false;

  try {
    orders = await prisma.order.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  } catch (err) {
    console.error("[admin/orders] DB not reachable:", err);
    dbError = true;
  }

  return (
    <main className="px-5 md:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="font-display font-extrabold text-3xl mb-10">ЗАМОВЛЕННЯ</h1>

        {dbError && (
          <p className="text-accent text-sm mb-8">
            Не вдалося підʼєднатися до бази даних. Перевірте DATABASE_URL у .env
            (див. README, розділ «База даних»).
          </p>
        )}

        {!dbError && orders.length === 0 && (
          <p className="text-muted text-sm">
            Замовлень ще немає. Оформіть тестове замовлення через /checkout, щоб побачити його тут.
          </p>
        )}

        {orders.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted border-b border-line">
                <th className="py-3">№ замовлення</th>
                <th className="py-3">Клієнт</th>
                <th className="py-3">Сума</th>
                <th className="py-3">Статус</th>
                <th className="py-3">Дата</th>
                <th className="py-3">Коментар</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line">
                  <td className="py-3.5 font-semibold">{o.orderNumber}</td>
                  <td className="py-3.5 text-muted">
                    {o.customer.firstName} {o.customer.lastName}
                  </td>
                  <td className="py-3.5 text-muted">{formatPrice(o.total)}</td>
                  <td className="py-3.5">
                    {ORDER_STATUS_LABELS[o.status as OrderStatus["code"]] ?? o.status}
                  </td>
                  <td className="py-3.5 text-muted">
                    {new Date(o.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="py-3.5 text-muted max-w-[220px] truncate" title={o.comment ?? ""}>
                    {o.comment ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="text-xs text-muted mt-8">
          Дані читаються напряму з таблиці <code>orders</code>. Зміна статусу
          замовлення (наприклад, позначити «Відправлено») — наступний крок,
          потребує окремого захищеного endpoint з автентифікацією адміна.
        </p>
      </div>
    </main>
  );
}
