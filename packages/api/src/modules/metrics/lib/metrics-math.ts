export function parseDecimal(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeChangePercent(
  value: number,
  previousValue: number | null,
): number | null {
  if (previousValue === null) return null;
  if (previousValue === 0) {
    if (value === 0) return 0;
    return null;
  }
  return round2(((value - previousValue) / Math.abs(previousValue)) * 100);
}
