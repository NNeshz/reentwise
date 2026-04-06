export class InvalidStripePriceError extends Error {
  constructor(message = "El price ID no es válido para este producto") {
    super(message);
    this.name = "InvalidStripePriceError";
  }
}
