export class BillingNotConfiguredError extends Error {
  constructor(message = "Facturación (Polar) no está configurada en el servidor") {
    super(message);
    this.name = "BillingNotConfiguredError";
  }
}
