"use client";

import type { ComponentType, ReactNode } from "react";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Separator } from "@reentwise/ui/src/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import {
  IconCalendar,
  IconCurrencyPeso,
  IconFileText,
  IconDoor,
  IconBuilding,
  IconUser,
  IconNotes,
} from "@tabler/icons-react";
import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_BADGE_CLASS,
  formatContractCurrency,
  formatContractDate,
  contractPaymentDayLabel,
} from "@/modules/contracts/lib/contract-display";

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

export function ContractDetailSheet({
  row,
  open,
  onOpenChange,
}: {
  row: ContractListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!row) return null;

  const { contract, tenant, room, property } = row;
  const statusLabel = CONTRACT_STATUS_LABELS[contract.status] ?? contract.status;
  const statusClass =
    CONTRACT_STATUS_BADGE_CLASS[contract.status] ?? CONTRACT_STATUS_BADGE_CLASS.draft;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Detalles del contrato
            <Badge className={`text-xs ${statusClass}`}>{statusLabel}</Badge>
          </SheetTitle>
          <SheetDescription>
            {tenant.name} · Hab. {room.roomNumber} · {property.name}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-6 px-4">
          <div className="space-y-4">
            <SectionLabel>Inquilino</SectionLabel>
            <DetailRow icon={IconUser} label="Nombre">
              <span>{tenant.name}</span>
            </DetailRow>
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionLabel>Ubicación</SectionLabel>
            <DetailRow icon={IconBuilding} label="Propiedad">
              <span>{property.name}</span>
            </DetailRow>
            <DetailRow icon={IconDoor} label="Habitación">
              <span>Hab. {room.roomNumber}</span>
            </DetailRow>
          </div>

          <Separator />

          <div className="space-y-4">
            <SectionLabel>Condiciones del contrato</SectionLabel>

            <DetailRow icon={IconCurrencyPeso} label="Renta mensual">
              <span className="text-base font-semibold">
                {formatContractCurrency(contract.rentAmount)}
              </span>
            </DetailRow>

            <DetailRow icon={IconCalendar} label="Día de cobro mensual">
              <span>{contractPaymentDayLabel(contract.paymentDay)}</span>
            </DetailRow>

            <DetailRow icon={IconCalendar} label="Vigencia">
              <span>
                {formatContractDate(contract.startsAt)}
                {" → "}
                {contract.endsAt
                  ? formatContractDate(contract.endsAt)
                  : "Sin fecha fin (indefinido)"}
              </span>
            </DetailRow>

            {Number(contract.deposit) > 0 && (
              <DetailRow icon={IconFileText} label="Depósito en garantía">
                <span>{formatContractCurrency(contract.deposit)}</span>
              </DetailRow>
            )}

            {contract.notes ? (
              <DetailRow icon={IconNotes} label="Notas">
                <span className="whitespace-pre-wrap">{contract.notes}</span>
              </DetailRow>
            ) : null}
          </div>

          {contract.signedAt && (
            <>
              <Separator />
              <div className="space-y-4">
                <SectionLabel>Fechas de gestión</SectionLabel>
                <DetailRow icon={IconCalendar} label="Fecha de firma / activación">
                  <span>{formatContractDate(contract.signedAt)}</span>
                </DetailRow>
                {contract.terminatedAt && (
                  <DetailRow icon={IconCalendar} label="Fecha de terminación">
                    <span>{formatContractDate(contract.terminatedAt)}</span>
                  </DetailRow>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
