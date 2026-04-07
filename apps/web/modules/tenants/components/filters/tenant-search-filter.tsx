"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@reentwise/ui/src/components/input";
import { useDebounce } from "@/utils/use-debounce";

const DEBOUNCE_MS = 300;

type Props = {
  /** Valor aplicado en el store (puede cambiar al resetear filtros). */
  committedSearch?: string;
  onDebouncedChange: (value: string | undefined) => void;
};

/**
 * Debounce vía `useDebounce` (timer en hook dedicado). Sincroniza el input cuando
 * el store limpia la búsqueda desde fuera (p. ej. "Limpiar filtros").
 * Solo notifica al store cuando el valor debouncado cambia para no resetear página en vano.
 */
export function TenantSearchFilter({
  committedSearch,
  onDebouncedChange,
}: Props) {
  const [inputValue, setInputValue] = useState(committedSearch ?? "");
  const debounced = useDebounce(inputValue, DEBOUNCE_MS);
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
      placeholder="Buscar nombre o WhatsApp"
      className="w-full max-w-xs"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
