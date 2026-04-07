"use client";

import { IconAlertCircle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@reentwise/ui/src/components/alert";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { errorMessageFromUnknown } from "@/utils/normalize-error";

type TenantOption = { id: string; name: string };

type Props = {
  value: string | undefined;
  onValueChange: (tenantId: string | undefined) => void;
  tenants: TenantOption[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function AuditTenantFilter({
  value,
  onValueChange,
  tenants,
  isLoading,
  error,
  onRetry,
  isRetrying,
}: Props) {
  if (isLoading) {
    return <Skeleton className="h-10 w-full min-w-[200px] sm:w-[220px]" />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="min-w-0 flex-1 py-2">
        <IconAlertCircle className="size-4" aria-hidden />
        <AlertTitle className="text-sm">Inquilinos</AlertTitle>
        <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs">
            {errorMessageFromUnknown(error, "Error al cargar")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-fit shrink-0 border-destructive/40"
            onClick={onRetry}
            disabled={isRetrying}
          >
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Select
      value={value ?? "all"}
      onValueChange={(v) => onValueChange(v === "all" ? undefined : v)}
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
  );
}
