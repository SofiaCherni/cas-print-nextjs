import type { PrintFormat } from "@/components/custom-print/GarmentMockup";

/**
 * Ціна нанесення за ОДНУ сторону, ₴, залежно від формату.
 * ⚠️ Постав свої реальні ціни (з тарифів старого сайту) — зараз це приклад.
 */
export const PRINT_PRICE: Record<PrintFormat, number> = {
  A6: 200,
  A5: 250,
  A4: 300,
  A3: 400
};

export const PRINT_FORMATS: PrintFormat[] = ["A6", "A5", "A4", "A3"];
