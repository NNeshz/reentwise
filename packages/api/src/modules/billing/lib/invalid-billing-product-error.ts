export class InvalidBillingProductError extends Error {
  constructor(message = "productId no coincide con ningún plan configurado") {
    super(message);
    this.name = "InvalidBillingProductError";
  }
}
