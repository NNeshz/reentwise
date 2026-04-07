"use client";

import { IconAlertCircle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@reentwise/ui/src/components/alert";
import { Button } from "@reentwise/ui/src/components/button";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { ROOMS_LIST_STACK_CLASS } from "@/modules/rooms/lib/room-display";

type Props = {
  error: unknown;
  onRetry: () => void;
  isRetrying?: boolean;
};

export function RoomsListError({ error, onRetry, isRetrying }: Props) {
  const message = errorMessageFromUnknown(
    error,
    "No se pudieron cargar las habitaciones",
  );

  return (
    <div className={ROOMS_LIST_STACK_CLASS}>
      <Alert variant="destructive" className="max-w-lg">
        <IconAlertCircle className="size-4" aria-hidden />
        <AlertTitle>No se pudieron cargar las habitaciones</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-destructive/90">{message}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-destructive/40 bg-transparent"
            onClick={() => onRetry()}
            disabled={isRetrying}
          >
            {isRetrying ? "Reintentando…" : "Reintentar"}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
