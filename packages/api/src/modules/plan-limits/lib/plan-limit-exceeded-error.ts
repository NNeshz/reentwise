/** Plan cap hit (e.g. max properties / rooms). Maps to HTTP 402 in routes. */
export class PlanLimitExceededError extends Error {
  readonly statusCode = 402 as const;
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitExceededError";
  }
}
