import Elysia from "elysia";
import { emailWebhookRoutes } from "@reentwise/api/src/modules/email/routes/webhook.routes";

/**
 * Email routes. Webhook uses raw string body for Svix verification.
 * Resend URL: `{NEXT_PUBLIC_BACKEND_URL}/api/email/webhook`
 */
export const emailRoutes = new Elysia({
  name: "emailRoutes",
  prefix: "/email",
}).onParse(async ({ request }) => {
  if (request.method !== "POST") return;
  if (!request.url.includes("/email/webhook")) return;
  return await request.text();
}).use(emailWebhookRoutes);
