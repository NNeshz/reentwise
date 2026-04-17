import type { ContractStatus } from "@/modules/contracts/types/contracts.types";

export const CONTRACTS_LIST_STACK_CLASS = "space-y-3";

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  renewed: "Renovado",
  terminated: "Terminado",
  expired: "Expirado",
};

export const CONTRACT_STATUS_BADGE_CLASS: Record<ContractStatus, string> = {
  active:
    "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-400",
  renewed:
    "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  terminated:
    "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400",
  expired:
    "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
  draft:
    "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export function formatContractCurrency(value: string | number | null): string {
  const num = Number(value ?? 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export function formatContractDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export const PAYMENT_DAY_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Último día del mes" },
  ...Array.from({ length: 28 }, (_, i) => ({
    value: i + 1,
    label: `Día ${i + 1}`,
  })),
];

export function contractPaymentDayLabel(day: number): string {
  if (day === 0) return "Último día del mes";
  return `Día ${day}`;
}
