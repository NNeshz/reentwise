/** Shared list pagination (owner-scoped list endpoints). */
export type ListPaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export function buildListPagination(
  page: number,
  limit: number,
  totalItems: number,
): ListPaginationMeta {
  const totalPages =
    totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
}
