type Props = {
  totalItems: number;
  isFetching: boolean;
};

export function AuditsResultSummary({ totalItems, isFetching }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        {totalItems} registro{totalItems !== 1 ? "s" : ""}
        {isFetching ? " · actualizando…" : ""}
      </span>
    </div>
  );
}
