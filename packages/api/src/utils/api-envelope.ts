/** Standard success body for owner JSON routes. */
export function apiSuccess<T>(message: string, data: T) {
  return {
    success: true as const,
    status: 200 as const,
    message,
    data,
  };
}

/** Standard error body (`set.status` must match `status`). */
export function apiError(status: number, message: string) {
  return {
    success: false as const,
    status,
    message,
  };
}
