/** Parse string query params from Elysia into numeric page/limit when valid. */
export function parseAuditsListQuery(query: {
  page?: string;
  limit?: string;
}): { page?: number; limit?: number } {
  const parsedPage =
    query.page != null ? Number.parseInt(query.page, 10) : NaN;
  const parsedLimit =
    query.limit != null ? Number.parseInt(query.limit, 10) : NaN;
  return {
    page: Number.isFinite(parsedPage) ? parsedPage : undefined,
    limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
  };
}
