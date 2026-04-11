/**
 * Checkout de billing: mismo origen que la web (`/api/...`).
 * `next.config.js` reescribe `/api/*` al backend (Elysia) para evitar CORS y
 * enviar cookies de sesión sin depender de que el origen esté en la lista CORS.
 */
export const BILLING_CHECKOUT_PATH = "/api/billing/crear-suscripcion" as const;
