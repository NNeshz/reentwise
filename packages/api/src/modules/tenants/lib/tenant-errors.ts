export class TenantValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantValidationError";
  }
}

export class TenantNotFoundError extends Error {
  constructor(message = "Tenant not found") {
    super(message);
    this.name = "TenantNotFoundError";
  }
}

export class TenantForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "TenantForbiddenError";
  }
}
