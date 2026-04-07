"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";

const LIMIT_OPTIONS = [10, 25, 50, 100] as const;

type Props = {
  value: number;
  onValueChange: (limit: number) => void;
};

export function AuditLimitFilter({ value, onValueChange }: Props) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onValueChange(Number.parseInt(v, 10))}
    >
      <SelectTrigger className="w-full min-w-[120px] sm:w-[130px]">
        <SelectValue placeholder="Por página" />
      </SelectTrigger>
      <SelectContent>
        {LIMIT_OPTIONS.map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n} / página
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
