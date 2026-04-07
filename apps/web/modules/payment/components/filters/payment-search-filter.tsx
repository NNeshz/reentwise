"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@reentwise/ui/src/components/input";
import { useDebounce } from "@/utils/use-debounce";

const DEBOUNCE_MS = 300;

type Props = {
  committedSearch: string;
  onDebouncedChange: (value: string) => void;
};

export function PaymentSearchFilter({
  committedSearch,
  onDebouncedChange,
}: Props) {
  const [inputValue, setInputValue] = useState(committedSearch);
  const debounced = useDebounce(inputValue, DEBOUNCE_MS);
  const lastApplied = useRef<string | undefined>(undefined);

  useEffect(() => {
    const next = debounced.trim();
    if (next === lastApplied.current) return;
    lastApplied.current = next;
    onDebouncedChange(next);
  }, [debounced, onDebouncedChange]);

  useEffect(() => {
    if (!committedSearch) {
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
