"use client";

import { useTenantsQuery } from "@/modules/tenants/hooks/use-tenants";
import { Card } from "@reentwise/ui/src/components/card";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { IconBrandWhatsapp, IconDoor } from "@tabler/icons-react";

type Tenant = {
  id: string;
  name: string;
  whatsapp: string;
  paymentDay: number;
  roomId: string | null;
  room: { id: string; roomNumber: string } | null;
};

function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("52") ? digits : `52${digits}`}`;
}

function TenantCard({ tenant }: { tenant: Tenant }) {
  const waLink = formatWhatsAppLink(tenant.whatsapp);
  const paymentLabel =
    tenant.paymentDay === 0 ? "Fin de mes" : `Día ${tenant.paymentDay}`;

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex items-center gap-4 p-4">
        <Avatar size="lg" className="h-12 w-12 shrink-0 border">
          <AvatarFallback className="bg-primary/10 text-base text-primary">
            {tenant.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-semibold text-foreground">
            {tenant.name}
          </p>
          {tenant.room ? (
            <div className="flex items-center gap-1.5">
              <IconDoor className="size-3.5 shrink-0 text-muted-foreground" />
              <Badge
                variant="secondary"
                className="w-fit text-xs font-normal"
              >
                Hab. {tenant.room.roomNumber}
              </Badge>
            </div>
          ) : (
            <span className="text-xs italic text-muted-foreground">
              Sin cuarto asignado
            </span>
          )}
          <p className="text-xs text-muted-foreground">{paymentLabel}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600"
          asChild
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar WhatsApp"
          >
            <IconBrandWhatsapp className="size-5" />
          </a>
        </Button>
      </div>
    </Card>
  );
}

function TenantCardSkeleton() {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
}

export function TenantsList() {
  const { data, isLoading, error } = useTenantsQuery();

  const tenants = (data?.tenants ?? []) as Tenant[];
  const pagination = data?.pagination;
  const totalProducts = pagination?.totalProducts ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TenantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar inquilinos
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No hay inquilinos que coincidan con los filtros
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prueba ajustar la búsqueda o los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{totalProducts} inquilino{totalProducts !== 1 ? "s" : ""}</span>
      </div>
      <ul className="space-y-3" role="list">
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <TenantCard tenant={tenant} />
          </li>
        ))}
      </ul>
    </div>
  );
}
