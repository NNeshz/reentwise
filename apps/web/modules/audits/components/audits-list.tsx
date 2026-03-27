"use client";

import { useMemo } from "react";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Card } from "@reentwise/ui/src/components/card";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@reentwise/ui/src/components/table";
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

function rowAccent(status: AuditStatus): string {
  switch (status) {
    case "sent":
      return "border-l-emerald-500";
    case "failed":
      return "border-l-orange-500";
    case "sending":
      return "border-l-amber-500";
    case "pending":
      return "border-l-slate-400";
    default:
      return "border-l-transparent";
  }
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
    <TableRow
      className={cn("border-l-4 bg-card/30 text-sm", rowAccent(row.status))}
    >
      <TableCell className="align-top font-mono text-xs text-muted-foreground">
        {formattedTime}
      </TableCell>
      <TableCell className="align-top">
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
      </TableCell>
      <TableCell className="align-top">
        <Badge
          variant="outline"
          className={cn("font-medium", statusStyles(row.status))}
        >
          {statusLabel(row.status)}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[140px] align-top">
        <span className="line-clamp-2 font-medium text-foreground">
          {row.tenantName}
        </span>
      </TableCell>
      <TableCell className="max-w-[min(40vw,280px)] align-top whitespace-normal">
        <span className="line-clamp-3 text-xs leading-snug text-muted-foreground">
          {row.note || "—"}
        </span>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );
}

export function AuditsList() {
  const { page, setPage } = useAuditsFilters();
  const { data, isLoading, error, isFetching } = useAuditsQuery();

  const audits = data?.audits ?? [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <Card className="border-border/60 bg-muted/20 p-4">
        <TableSkeleton />
      </Card>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
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
      <div className="rounded-xl border border-dashed border-border/80 bg-muted/10 py-16 text-center">
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

      <Card className="overflow-hidden border-border/70 bg-muted/15 p-0 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/80 hover:bg-transparent">
              <TableHead className="w-[200px] font-mono text-xs uppercase tracking-wide text-muted-foreground">
                Fecha / hora
              </TableHead>
              <TableHead className="w-[120px] text-xs uppercase tracking-wide text-muted-foreground">
                Canal
              </TableHead>
              <TableHead className="w-[120px] text-xs uppercase tracking-wide text-muted-foreground">
                Estado
              </TableHead>
              <TableHead className="min-w-[140px] text-xs uppercase tracking-wide text-muted-foreground">
                Inquilino
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                Nota
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((row) => (
              <AuditRowView key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </Card>

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
