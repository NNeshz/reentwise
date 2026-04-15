export class OwnerProfileNotFoundError extends Error {
  constructor(message = "User profile not found") {
    super(message);
    this.name = "OwnerProfileNotFoundError";
  }
}
