import Elysia from "elysia";
import { billingWebhookRoutes } from "@reentwise/api/src/modules/billing/routes/webhook.routes";
import { billingOwnerRoutes } from "@reentwise/api/src/modules/billing/routes/owner.routes";

export const billingRoutes = new Elysia({
  name: "billingRoutes",
  prefix: "/billing",
})
  .onParse(async ({ request }) => {
    if (request.method !== "POST") return;
    if (!request.url.includes("/billing/webhook")) return;
    return await request.text();
  })
  .use(billingWebhookRoutes)
  .use(billingOwnerRoutes);
