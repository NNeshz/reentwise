/** Polar ya tiene suscripción activa para este `external_customer_id`; no se puede abrir otro checkout hasta cancelar o usar el portal. */
export class BillingActivePolarSubscriptionError extends Error {
  readonly statusCode = 409 as const;
  constructor(message: string) {
    super(message);
    this.name = "BillingActivePolarSubscriptionError";
  }
}
