"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@reentwise/ui/src/components/button";
import { Input } from "@reentwise/ui/src/components/input";
import { IconFilterOff } from "@tabler/icons-react";
import { useContractsFilters } from "@/modules/contracts/store/use-contracts-filters";
import { useDebounce } from "@/utils/use-debounce";

function ContractSearchInput({
  committedSearch,
  onDebouncedChange,
}: {
  committedSearch?: string;
  onDebouncedChange: (v: string | undefined) => void;
}) {
  const [inputValue, setInputValue] = useState(committedSearch ?? "");
  const debounced = useDebounce(inputValue, 300);
  const lastApplied = useRef<string | undefined>(undefined);

  useEffect(() => {
    const next = debounced.trim() || undefined;
    if (next === lastApplied.current) return;
    lastApplied.current = next;
    onDebouncedChange(next);
  }, [debounced, onDebouncedChange]);

  useEffect(() => {
    if (committedSearch === undefined || committedSearch === "") {
      setInputValue("");
    }
  }, [committedSearch]);

  return (
    <Input
      placeholder="Buscar por nombre del inquilino"
      className="w-full max-w-xs"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}

export function ContractsFilters() {
  const { search, setSearch, resetFilters } = useContractsFilters();

  const onDebouncedSearch = useCallback(
    (v: string | undefined) => setSearch(v),
    [setSearch],
  );

  const hasActiveFilters = search != null && search.trim() !== "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <ContractSearchInput
          committedSearch={search}
          onDebouncedChange={onDebouncedSearch}
        />
      </div>
      {hasActiveFilters ? (
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
      ) : null}
    </div>
  );
}
