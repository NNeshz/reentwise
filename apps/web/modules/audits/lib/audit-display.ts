import { cn } from "@reentwise/ui/src/lib/utils";
import type { AuditStatus } from "@/modules/audits/types/audits.types";

/** Columnas alineadas entre cabecera y filas; scroll horizontal en pantallas angostas. */
export const AUDITS_TABLE_GRID_CLASS =
  "grid w-full min-w-[640px] grid-cols-[11rem_6.5rem_6.5rem_9rem_minmax(0,1fr)] gap-x-3 gap-y-1 items-start";

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatAuditLoggedAt(loggedAt: string | Date): string {
  try {
    return dateTimeFormatter.format(new Date(loggedAt));
  } catch {
    return "—";
  }
}

export function auditStatusLabel(status: AuditStatus): string {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "sending":
      return "Enviando";
    case "sent":
      return "Enviado";
    case "failed":
      return "Fallido";
    default:
      return status;
  }
}

export function auditStatusBadgeClassName(status: AuditStatus): string {
  switch (status) {
    case "sent":
      return "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
    case "failed":
      return "border-orange-500/60 bg-orange-500/10 text-orange-900 dark:text-orange-300";
    case "sending":
      return "border-amber-500/60 bg-amber-500/10 text-amber-900 dark:text-amber-200";
    case "pending":
      return "border-slate-400/50 bg-slate-500/10 text-slate-800 dark:text-slate-300";
    default:
      return "border-border bg-muted text-foreground";
  }
}

export function auditsTableHeaderRowClassName(extra?: string): string {
  return cn(AUDITS_TABLE_GRID_CLASS, "py-2.5", extra);
}
