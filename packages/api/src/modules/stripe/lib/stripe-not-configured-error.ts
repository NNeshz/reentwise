export class StripeNotConfiguredError extends Error {
  constructor(message = "Stripe no está configurado en el servidor") {
    super(message);
    this.name = "StripeNotConfiguredError";
  }
}
