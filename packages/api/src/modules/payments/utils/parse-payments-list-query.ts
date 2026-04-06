/** Parse month/year query strings; defaults to current local calendar month/year. */
export function parsePaymentsListQuery(query: {
  month?: string;
  year?: string;
}): { month: number; year: number } {
  const now = new Date();
  const parsedMonth =
    query.month != null ? Number.parseInt(query.month, 10) : NaN;
  const parsedYear =
    query.year != null ? Number.parseInt(query.year, 10) : NaN;
  return {
    month: Number.isFinite(parsedMonth) ? parsedMonth : now.getMonth() + 1,
    year: Number.isFinite(parsedYear) ? parsedYear : now.getFullYear(),
  };
}
