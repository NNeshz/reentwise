"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { useAuditsFilters } from "@/modules/audits/store/use-audits-filters";
import { tenantsService } from "@/modules/tenants/service/tenants-service";
import { IconFilterOff } from "@tabler/icons-react";

export function AuditsFilters() {
  const {
    tenantId,
    channel,
    status,
    limit,
    setTenantId,
    setChannel,
    setStatus,
    setLimit,
    resetFilters,
  } = useAuditsFilters();

  const { data: tenantsData } = useQuery({
    queryKey: ["tenants", "audits-filter"],
    queryFn: () => tenantsService.getTenants({ page: 1 }),
    staleTime: 1000 * 60 * 5,
  });

  const tenants = tenantsData?.tenants ?? [];
  const hasActiveFilters =
    !!tenantId || !!channel || !!status || limit !== 25;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <Select
          value={tenantId ?? "all"}
          onValueChange={(v) => setTenantId(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="w-full min-w-[200px] sm:w-[220px]">
            <SelectValue placeholder="Inquilino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los inquilinos</SelectItem>
            {tenants.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={channel ?? "all"}
          onValueChange={(v) =>
            setChannel(
              v === "all" ? undefined : (v as "email" | "whatsapp"),
            )
          }
        >
          <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            <SelectItem value="email">Correo</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status ?? "all"}
          onValueChange={(v) =>
            setStatus(
              v === "all"
                ? undefined
                : (v as "pending" | "sending" | "sent" | "failed"),
            )
          }
        >
          <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="sending">Enviando</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="failed">Fallido</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(v) => setLimit(Number.parseInt(v, 10))}
        >
          <SelectTrigger className="w-full min-w-[120px] sm:w-[130px]">
            <SelectValue placeholder="Por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / página</SelectItem>
            <SelectItem value="25">25 / página</SelectItem>
            <SelectItem value="50">50 / página</SelectItem>
            <SelectItem value="100">100 / página</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => resetFilters()}
        >
          <IconFilterOff className="size-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
