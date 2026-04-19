import type { TenantPaymentRecord } from "@/modules/tenants/types/tenants.types";

export const TENANTS_LIST_STACK_CLASS = "space-y-3";

export const TENANT_MONTH_NAMES = [
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

export const TENANT_PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  deposit: "Depósito",
};

export function formatTenantPaymentCurrency(value: string | number | null) {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export function tenantPaymentPeriodLabel(payment: TenantPaymentRecord): string {
  if (payment.reason === "deposit") return "Depósito en garantía";
  if (payment.reason === "extra") return "Cobro adicional";
  const monthName = TENANT_MONTH_NAMES[payment.month - 1] ?? String(payment.month);
  return `${monthName} ${payment.year}`;
}

export function formatWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("52") ? digits : `52${digits}`}`;
}

export function tenantCountLabel(count: number): string {
  return `${count} inquilino${count !== 1 ? "s" : ""}`;
}

export function tenantPaymentDayLabel(paymentDay: number): string {
  return paymentDay === 0 ? "Fin de mes" : `Día ${paymentDay}`;
}
