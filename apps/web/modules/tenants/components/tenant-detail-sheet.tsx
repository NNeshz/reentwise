"use client";

import type { ComponentType, ReactNode } from "react";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import { Separator } from "@reentwise/ui/src/components/separator";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import {
  IconBrandWhatsapp,
  IconMail,
  IconDoor,
  IconCalendar,
  IconBuilding,
  IconFileText,
  IconPencil,
  IconCurrencyPeso,
  IconNotes,
} from "@tabler/icons-react";
import type { TenantListRow } from "@/modules/tenants/types/tenants.types";
import {
  formatWhatsAppHref,
  formatTenantPaymentCurrency,
  tenantPaymentDayLabel,
  TENANT_MONTH_NAMES,
} from "@/modules/tenants/lib/tenant-display";
import { TenantPaymentStatusBadge } from "@/modules/tenants/components/tenant-payment-status-badge";
import { useTenantDetail } from "@/modules/tenants/hooks/use-tenants";

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

const CONTRACT_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  active: "Activo",
  renewed: "Renovado",
  terminated: "Terminado",
  expired: "Expirado",
};

const CONTRACT_STATUS_CLASSES: Record<string, string> = {
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

function formatDateMx(dateStr: string | null | undefined): string {
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

function currentMonthLabel(): string {
  const now = new Date();
  return `${TENANT_MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
}

function DetailSkeleton() {
  return (
    <div className="space-y-5 px-4">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-3.5 w-36" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 rounded-md" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TenantDetailSheet({
  tenant,
  open,
  onOpenChange,
  onEdit,
}: {
  tenant: TenantListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}) {
  const { data: detail, isPending, isError } = useTenantDetail(
    tenant?.id ?? null,
    open,
  );

  if (!tenant) return null;

  const waLink = formatWhatsAppHref(tenant.whatsapp);
  const paymentLabel = tenantPaymentDayLabel(tenant.paymentDay);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader className="items-center text-center">
          <Avatar size="lg" className="h-16 w-16 border">
            <AvatarFallback className="bg-primary/10 text-lg text-primary-figure">
              {tenant.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <SheetTitle className="text-lg">{tenant.name}</SheetTitle>
          <SheetDescription asChild>
            <div>
              {tenant.room ? (
                <Badge variant="secondary" className="text-xs font-normal">
                  Hab. {tenant.room.roomNumber}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs font-normal text-muted-foreground"
                >
                  Sin habitación asignada
                </Badge>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {isPending ? (
          <DetailSkeleton />
        ) : isError ? (
          <div className="space-y-5 px-4">
            {/* fallback: show basic data from list row */}
            <div className="space-y-4">
              <SectionLabel>Contacto</SectionLabel>
              <DetailRow icon={IconMail} label="Correo electrónico">
                <span className="break-all">{tenant.email}</span>
              </DetailRow>
              <DetailRow icon={IconBrandWhatsapp} label="WhatsApp">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {tenant.whatsapp}
                </a>
              </DetailRow>
              <DetailRow icon={IconCalendar} label="Día de pago">
                <span>{paymentLabel}</span>
              </DetailRow>
            </div>
          </div>
        ) : (
          <div className="space-y-6 px-4">
            {/* Contacto */}
            <div className="space-y-4">
              <SectionLabel>Contacto</SectionLabel>
              <DetailRow icon={IconMail} label="Correo electrónico">
                <span className="break-all">{detail.tenant.email}</span>
              </DetailRow>
              <DetailRow icon={IconBrandWhatsapp} label="WhatsApp">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  {detail.tenant.whatsapp}
                </a>
              </DetailRow>
              <DetailRow icon={IconCalendar} label="Día de pago">
                <span>{tenantPaymentDayLabel(detail.tenant.paymentDay)}</span>
              </DetailRow>
              {detail.tenant.notes ? (
                <DetailRow icon={IconNotes} label="Notas">
                  <span className="whitespace-pre-wrap">{detail.tenant.notes}</span>
                </DetailRow>
              ) : null}
            </div>

            {/* Propiedad y Cuarto */}
            {(detail.property || detail.room) ? (
              <>
                <Separator />
                <div className="space-y-4">
                  <SectionLabel>Ubicación</SectionLabel>
                  {detail.property ? (
                    <DetailRow icon={IconBuilding} label="Propiedad">
                      <span>{detail.property.name ?? "—"}</span>
                    </DetailRow>
                  ) : null}
                  {detail.room ? (
                    <DetailRow icon={IconDoor} label="Habitación">
                      <span>Hab. {detail.room.roomNumber ?? "—"}</span>
                    </DetailRow>
                  ) : null}
                </div>
              </>
            ) : null}

            {/* Contrato */}
            {detail.contract ? (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <SectionLabel>Contrato</SectionLabel>
                    <Badge
                      className={`text-xs ${CONTRACT_STATUS_CLASSES[detail.contract.status] ?? CONTRACT_STATUS_CLASSES.draft}`}
                    >
                      {CONTRACT_STATUS_LABELS[detail.contract.status] ?? detail.contract.status}
                    </Badge>
                  </div>

                  <DetailRow icon={IconCurrencyPeso} label="Renta mensual">
                    <span className="font-semibold text-base">
                      {formatTenantPaymentCurrency(detail.contract.rentAmount)}
                    </span>
                  </DetailRow>

                  <DetailRow icon={IconCalendar} label="Vigencia">
                    <span>
                      {formatDateMx(detail.contract.startsAt)}
                      {" → "}
                      {detail.contract.endsAt
                        ? formatDateMx(detail.contract.endsAt)
                        : "Sin fecha fin"}
                    </span>
                  </DetailRow>

                  {Number(detail.contract.deposit) > 0 ? (
                    <DetailRow icon={IconFileText} label="Depósito">
                      <span>{formatTenantPaymentCurrency(detail.contract.deposit)}</span>
                    </DetailRow>
                  ) : null}
                </div>
              </>
            ) : null}

            {/* Pago del mes actual */}
            {detail.currentMonthPayment ? (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <SectionLabel>Pago de {currentMonthLabel()}</SectionLabel>
                    <TenantPaymentStatusBadge
                      status={detail.currentMonthPayment.status}
                    />
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium tabular-nums">
                        {formatTenantPaymentCurrency(detail.currentMonthPayment.amount)}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground">Pagado</span>
                      <span className="font-medium tabular-nums">
                        {formatTenantPaymentCurrency(detail.currentMonthPayment.amountPaid)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        <Separator className="mt-auto" />

        <div className="flex gap-2 px-4 pb-4">
          {onEdit ? (
            <Button
              variant="default"
              className="flex-1"
              onClick={onEdit}
            >
              <IconPencil className="size-4" />
              Editar
            </Button>
          ) : null}
          <Button variant="outline" className="flex-1" asChild>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <IconBrandWhatsapp className="size-4" />
              Mensaje
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
