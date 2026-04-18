import { cn } from "@reentwise/ui/src/lib/utils";
import type {
  PaymentListRow,
  PaymentMonthRow,
  PaymentTenantRow,
} from "@/modules/payment/types/payment.types";

export const PAYMENTS_LIST_STACK_CLASS = "space-y-3";

/** Columnas alineadas entre cabecera y filas; scroll horizontal en pantallas angostas.
 *  1.5fr = Inquilino | 1fr = Habitación | 1.5fr = Estado | 5.5rem = Total | 5.5rem = Pagado | 2.5rem = Acciones */
export const PAYMENTS_TABLE_GRID_CLASS =
  "grid w-full min-w-[600px] grid-cols-[1.5fr_1fr_1.5fr_5.5rem_5.5rem_2.5rem] gap-x-3 items-center";

export function paymentsTableHeaderRowClassName(extra?: string): string {
  return cn(PAYMENTS_TABLE_GRID_CLASS, "py-2.5", extra);
}

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

/** Etiqueta de próximo cobro cuando aún no hay fila de pago del mes.
 *  `month` es 1-based (1=Ene … 12=Dic); Date usa 0-based internamente.
 *  paymentDay=0 significa último día del mes.
 */
export function nextCollectionBadgeLabel(
  tenant: PaymentTenantRow,
  month: number,
  year: number,
): string {
  const paymentDay = tenant.paymentDay;

  // new Date(year, month, 0) = último día de mes `month` en 1-based (truco: day=0 del mes siguiente)
  const dueDate =
    paymentDay === 0
      ? new Date(year, month, 0)
      : new Date(year, month - 1, paymentDay);

  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
  }).format(dueDate);

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
