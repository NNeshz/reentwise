"use client";

import * as React from "react";
import type { ComponentType, ReactNode } from "react";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reentwise/ui/src/components/dialog";
import { Input } from "@reentwise/ui/src/components/input";
import { Label } from "@reentwise/ui/src/components/label";
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
  IconShieldCheck,
  IconCircleDashed,
  IconClock,
} from "@tabler/icons-react";
import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import { useQueryClient } from "@tanstack/react-query";
import { contractsService } from "@/modules/contracts/service/contracts-service";
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

function MarkDepositDialog({
  contractId,
  depositAgreed,
  open,
  onOpenChange,
  onSuccess,
}: {
  contractId: string;
  depositAgreed: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = React.useState(depositAgreed ?? "");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await contractsService.markDepositCollected(contractId, {
        amountCollected: amount,
        collectedAt: new Date(date).toISOString(),
      });
      onSuccess();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registrar cobro del depósito</DialogTitle>
          <DialogDescription>
            Confirma el monto recibido y la fecha de cobro.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Monto cobrado</Label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              className="tabular-nums"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de cobro</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !amount}>
            {loading ? "Guardando…" : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [markDepositOpen, setMarkDepositOpen] = React.useState(false);
  const queryClient = useQueryClient();

  if (!row) return null;

  const { contract, tenant, room, property } = row;
  const statusLabel = CONTRACT_STATUS_LABELS[contract.status] ?? contract.status;
  const statusClass =
    CONTRACT_STATUS_BADGE_CLASS[contract.status] ?? CONTRACT_STATUS_BADGE_CLASS.draft;

  return (
    <>
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

            <DetailRow icon={IconCalendar} label="Día de entrada">
              <span className="font-medium">
                {formatContractDate(contract.startsAt)}
              </span>
            </DetailRow>

            <DetailRow icon={IconCalendar} label="Fecha de fin del contrato">
              <span>
                {contract.endsAt
                  ? formatContractDate(contract.endsAt)
                  : "Sin fecha fin (indefinido)"}
              </span>
            </DetailRow>

            <DetailRow icon={IconClock} label="Días de gracia">
              <span>{contract.graceDays ?? 2} días</span>
            </DetailRow>

            {Number(contract.deposit) > 0 && (
              <DetailRow icon={IconFileText} label="Depósito en garantía">
                <div className="space-y-1">
                  <p className="font-medium">
                    {formatContractCurrency(contract.deposit)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">acordado</span>
                  </p>
                  {contract.depositCollectedAt ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                      <IconShieldCheck className="size-3.5 shrink-0" />
                      <span>
                        Cobrado el {formatContractDate(contract.depositCollectedAt)}
                        {contract.depositAmountCollected &&
                          contract.depositAmountCollected !== contract.deposit
                          ? ` — ${formatContractCurrency(contract.depositAmountCollected)}`
                          : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconCircleDashed className="size-3.5 shrink-0" />
                        <span>Pendiente de cobro</span>
                      </div>
                      {contract.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => setMarkDepositOpen(true)}
                        >
                          Marcar como cobrado
                        </Button>
                      )}
                    </div>
                  )}
                </div>
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

    <MarkDepositDialog
      contractId={contract.id}
      depositAgreed={contract.deposit}
      open={markDepositOpen}
      onOpenChange={setMarkDepositOpen}
      onSuccess={() => void queryClient.invalidateQueries({ queryKey: ["contracts"] })}
    />
    </>
  );
}
