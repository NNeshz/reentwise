import Elysia from "elysia";
import { emailWebhookRoutes } from "@reentwise/api/src/modules/email/routes/webhook.routes";

/**
 * Rutas relacionadas con correo. El webhook usa cuerpo en bruto (JSON string) para la firma Svix.
 * URL del endpoint en Resend: `{NEXT_PUBLIC_BACKEND_URL}/api/email/webhook`
 */
export const emailRoutes = new Elysia({
  name: "emailRoutes",
  prefix: "/email",
}).onParse(async ({ request }) => {
  if (request.method !== "POST") return;
  if (!request.url.includes("/email/webhook")) return;
  return await request.text();
}).use(emailWebhookRoutes);
