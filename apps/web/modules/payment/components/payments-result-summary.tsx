type Props = {
  count: number;
  isFetching?: boolean;
};

export function PaymentsResultSummary({ count, isFetching }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        {count} inquilino{count !== 1 ? "s" : ""}
        {isFetching ? " · actualizando…" : ""}
      </span>
    </div>
  );
}
