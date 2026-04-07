import type {
  PaymentListRow,
  PaymentMonthRow,
  PaymentTenantRow,
} from "@/modules/payment/types/payment.types";

export const PAYMENTS_LIST_STACK_CLASS = "space-y-3";

export function formatPaymentCurrency(value: string | number | null) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export const PAYMENT_MONTH_LABELS_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

export const PAYMENT_MONTH_LABELS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/** Etiqueta de próximo cobro cuando aún no hay fila de pago del mes (misma lógica que la UI previa). */
export function nextCollectionBadgeLabel(
  tenant: PaymentTenantRow,
  month: number,
  year: number,
): string {
  const paymentDay = tenant.paymentDay;
  const nextMonthDate = new Date(
    year,
    month,
    paymentDay === 0 ? 0 : paymentDay,
  );
  if (paymentDay === 0) {
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    nextMonthDate.setDate(0);
  }

  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
  }).format(nextMonthDate);

  return `Próximo cobro: ${formattedDate}`;
}

export function paymentRowHasPendingDebt(row: PaymentListRow): boolean {
  const { payment } = row;
  return !!(
    payment &&
    payment.status !== "paid" &&
    payment.status !== "annulled"
  );
}

export function tenantCountLabel(count: number): string {
  return `${count} inquilino${count !== 1 ? "s" : ""}`;
}
