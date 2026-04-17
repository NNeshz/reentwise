"use client";

import { Button } from "@reentwise/ui/src/components/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { ContractsListPagination } from "@/modules/contracts/types/contracts.types";

type Props = {
  pagination: ContractsListPagination;
  onPrevious: () => void;
  onNext: () => void;
};

export function ContractsPagination({ pagination, onPrevious, onNext }: Props) {
  if (pagination.totalPages <= 0) return null;

  return (
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
          onClick={onPrevious}
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
          onClick={onNext}
        >
          Siguiente
          <IconChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
