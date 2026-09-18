/**
 * Minimal email sending via the Resend API (https://resend.com) — chosen
 * because it needs only a REST call (no SMTP setup) and has a free tier
 * that's enough for a small shop's order volume. Swap this file out if
 * CAS-Print already uses a different provider.
 *
 * Required env vars (see .env.example):
 *   RESEND_API_KEY          — from resend.com dashboard
 *   ORDERS_FROM_EMAIL       — a verified sender, e.g. orders@cas-print.com.ua
 *   ORDERS_NOTIFICATION_EMAIL — where new-order alerts go (shop owner's inbox)
 */
interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDERS_FROM_EMAIL;

  if (!apiKey || !from) {
    // Not configured yet — log instead of throwing, so checkout still
    // succeeds locally before email is set up. See README "Пошта" section.
    console.warn("[email] RESEND_API_KEY or ORDERS_FROM_EMAIL not set — skipping send:", {
      to,
      subject
    });
    return { skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Resend API error:", res.status, text);
    return { skipped: false, error: text };
  }
  return { skipped: false, error: null };
}

export function orderConfirmationEmail(orderNumber: string, total: number) {
  return `
    <div style="font-family:sans-serif;">
      <h2>Замовлення №${orderNumber} прийнято</h2>
      <p>Дякуємо за замовлення в CAS-Print! Сума: ${total} ₴.</p>
      <p>Ми зв'яжемось з вами найближчим часом для підтвердження.</p>
    </div>`;
}

export function orderNotificationEmail(
  orderNumber: string,
  total: number,
  phone: string,
  contactMethod: string,
  comment?: string
) {
  const methodLabel: Record<string, string> = {
    viber: "Viber",
    telegram: "Telegram",
    whatsapp: "WhatsApp"
  };
  return `
    <div style="font-family:sans-serif;">
      <h2>Нове замовлення №${orderNumber}</h2>
      <p>Сума: ${total} ₴</p>
      <p>Телефон клієнта: ${phone}</p>
      <p>Звʼязатися через: ${methodLabel[contactMethod] ?? contactMethod}</p>
      ${comment ? `<p>Коментар: ${comment}</p>` : ""}
      <p>Деталі — в адмінці / базі даних.</p>
    </div>`;
}

export function customPrintNotificationEmail(fileUrl: string, text: string, comment: string) {
  return `
    <div style="font-family:sans-serif;">
      <h2>Нова заявка на власний принт</h2>
      <p>Файл: <a href="${fileUrl}">${fileUrl}</a></p>
      <p>Текст на принті: ${text || "—"}</p>
      <p>Коментар: ${comment || "—"}</p>
    </div>`;
}
