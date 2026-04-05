"use client";

import { useMemo, type ReactNode } from "react";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  IconBrandWhatsapp,
  IconChevronLeft,
  IconChevronRight,
  IconMail,
} from "@tabler/icons-react";
import { cn } from "@reentwise/ui/src/lib/utils";
import { useAuditsQuery } from "@/modules/audits/hooks/use-audits";
import { useAuditsFilters } from "@/modules/audits/store/use-audits-filters";
import type {
  AuditRow,
  AuditStatus,
} from "@/modules/audits/service/audits-service";

/** Columnas alineadas entre cabecera y filas; ancho mínimo para scroll horizontal en pantallas angostas. */
const AUDITS_GRID_CLASS =
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

function statusLabel(status: AuditStatus): string {
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

function statusStyles(status: AuditStatus): string {
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

function AuditsTableHeader() {
  return (
    <div className={cn(AUDITS_GRID_CLASS, "py-2.5")}>
      <div className="font-mono text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Fecha / hora
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Canal
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Estado
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Inquilino
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Nota
      </div>
    </div>
  );
}

function AuditRowView({ row }: { row: AuditRow }) {
  const formattedTime = useMemo(() => {
    try {
      return dateTimeFormatter.format(new Date(row.loggedAt));
    } catch {
      return "—";
    }
  }, [row.loggedAt]);

  return (
    <li className="py-3 text-sm">
      <div className={AUDITS_GRID_CLASS}>
        <span className="font-mono text-xs text-muted-foreground">
          {formattedTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {row.channel === "whatsapp" ? (
            <IconBrandWhatsapp
              className="size-4 shrink-0"
              aria-hidden
            />
          ) : (
            <IconMail className="size-4 shrink-0" aria-hidden />
          )}
          <span className="capitalize">{row.channel}</span>
        </span>
        <Badge
          variant="outline"
          className={cn("w-fit font-medium", statusStyles(row.status))}
        >
          {statusLabel(row.status)}
        </Badge>
        <span className="min-w-0 font-medium text-foreground">
          <span className="line-clamp-2">{row.tenantName}</span>
        </span>
        <span className="min-w-0 text-xs leading-snug text-muted-foreground">
          <span className="line-clamp-3 whitespace-normal">
            {row.note || "—"}
          </span>
        </span>
      </div>
    </li>
  );
}

function AuditsListFrame({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto bg-transparent">{children}</div>;
}

function AuditsListSkeleton() {
  return (
    <AuditsListFrame>
      <div className={cn(AUDITS_GRID_CLASS, "px-3 py-2.5")}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <ul className="flex flex-col gap-1" role="list">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="px-3 py-3">
            <div className={AUDITS_GRID_CLASS}>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
          </li>
        ))}
      </ul>
    </AuditsListFrame>
  );
}

export function AuditsList() {
  const { page, setPage } = useAuditsFilters();
  const { data, isLoading, error, isFetching } = useAuditsQuery();

  const audits = data?.audits ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return <AuditsListSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          No se pudieron cargar las auditorías
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </div>
    );
  }

  if (audits.length === 0) {
    return (
      <div className="rounded-xl bg-muted/10 py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No hay registros con estos filtros
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prueba ampliar el rango o limpiar filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {pagination?.totalItems ?? 0} registro
          {(pagination?.totalItems ?? 0) !== 1 ? "s" : ""}
          {isFetching ? " · actualizando…" : ""}
        </span>
      </div>

      <AuditsListFrame>
        <AuditsTableHeader />
        <ul className="flex flex-col gap-1" role="list">
          {audits.map((row) => (
            <AuditRowView key={row.id} row={row} />
          ))}
        </ul>
      </AuditsListFrame>

      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            Página{" "}
            <span className="font-mono text-foreground">
              {pagination.currentPage}
            </span>{" "}
            de{" "}
            <span className="font-mono text-foreground">
              {pagination.totalPages}
            </span>
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={!pagination.hasPreviousPage}
              onClick={() => setPage(page - 1)}
            >
              <IconChevronLeft className="size-4" />
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
