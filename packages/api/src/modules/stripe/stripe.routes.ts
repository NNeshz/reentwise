import Elysia from "elysia";
import { stripeWebhookRoutes } from "@reentwise/api/src/modules/stripe/routes/webhook.routes";
import { stripeOwnerRoutes } from "@reentwise/api/src/modules/stripe/routes/owner.routes";

export const stripeRoutes = new Elysia({
  name: "stripeRoutes",
  prefix: "/stripe",
}).onParse(async ({ request }) => {
  if (request.method !== "POST") return;
  if (!request.url.includes("/stripe/webhook")) return;
  return await request.text();
}).use(stripeWebhookRoutes).use(stripeOwnerRoutes);
