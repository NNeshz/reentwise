export class PropertyNotFoundError extends Error {
  constructor(message = "Property not found") {
    super(message);
    this.name = "PropertyNotFoundError";
  }
}
