import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { sendEmail, customPrintNotificationEmail } from "@/lib/email";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB — adjust to real business limit

/**
 * Accepts a custom-print request (brief section 28). The file is validated
 * by MIME type and size on the server, then uploaded to Vercel Blob — a
 * private-by-default object storage that works out of the box on Vercel
 * (no separate S3 bucket to provision). It is never written into /public.
 * The request is persisted via Prisma and triggers a notification email to
 * the shop; there is no automated reply to the customer here since a human
 * needs to review the artwork first.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;
  const size = formData.get("size") as string | null;
  const colorName = formData.get("colorName") as string | null;
  const text = formData.get("text") as string | null;
  const comment = formData.get("comment") as string | null;
  const customerName = formData.get("customerName") as string | null;
  const customerPhone = formData.get("customerPhone") as string | null;
  const customerEmail = formData.get("customerEmail") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Додайте зображення." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Непідтримуваний тип файлу." }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Файл завеликий." }, { status: 413 });
  }
  if (!productId || !size || !colorName || !customerName || !customerPhone || !customerEmail) {
    return NextResponse.json({ error: "Заповніть усі обовʼязкові поля." }, { status: 400 });
  }

  try {
    const blob = await put(`custom-prints/${Date.now()}-${file.name}`, file, {
      access: "public" // signed/private access requires a paid Blob tier; see README note
    });

    const request = await prisma.customPrintRequest.create({
      data: {
        productId,
        size,
        colorName,
        fileUrl: blob.url,
        text: text || undefined,
        comment: comment || undefined,
        customerName,
        customerPhone,
        customerEmail,
        status: "new"
      }
    });

    const notifyEmail = process.env.ORDERS_NOTIFICATION_EMAIL;
    if (notifyEmail) {
      await sendEmail({
        to: notifyEmail,
        subject: "Нова заявка на власний принт",
        html: customPrintNotificationEmail(blob.url, text || "", comment || "")
      });
    }

    return NextResponse.json({ status: "received", id: request.id }, { status: 201 });
  } catch (err) {
    console.error("[custom-print-requests] failed:", err);
    return NextResponse.json(
      { error: "Не вдалося надіслати заявку. Спробуйте ще раз." },
      { status: 500 }
    );
  }
}
