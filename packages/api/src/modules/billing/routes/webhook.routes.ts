import Elysia from "elysia";
import { env } from "@reentwise/api/src/utils/envs";
import { BillingNotConfiguredError } from "@reentwise/api/src/modules/billing/lib/billing-not-configured-error";
import { billingService } from "@reentwise/api/src/modules/billing/billing.service";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  billingWebhookSuccessSchema,
  billingWebhookBadRequestSchema,
  billingWebhookServerErrorSchema,
  billingWebhookServiceUnavailableSchema,
} from "@reentwise/api/src/modules/billing/billing.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

export const billingWebhookRoutes = new Elysia({
  name: "billingWebhookRoutes",
}).post(
  "/webhook",
  async ({ body, request, set }) => {
    if (!env.POLAR_WEBHOOK_SECRET?.trim()) {
      set.status = 503;
      return apiError(503, "POLAR_WEBHOOK_SECRET no configurada");
    }

    const rawBody = typeof body === "string" ? body : "";
    if (!rawBody) {
      set.status = 400;
      return apiError(400, "Cuerpo del webhook vacío");
    }

    try {
      await billingService.handleWebhookRequest(request, rawBody);
    } catch (err) {
      if (err instanceof BillingNotConfiguredError) {
        set.status = 503;
        return apiError(503, err.message);
      }
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes("webhook-id") ||
        message.includes("signature") ||
        message.includes("Webhook")
      ) {
        set.status = 400;
        return apiError(400, `Webhook Error: ${message}`);
      }
      console.error("[billing] webhook handler error:", err);
      set.status = 500;
      return apiError(500, "Webhook processing failed");
    }

    return apiSuccess("Event received", { received: true as const });
  },
  {
    response: {
      200: billingWebhookSuccessSchema,
      400: billingWebhookBadRequestSchema,
      500: billingWebhookServerErrorSchema,
      503: billingWebhookServiceUnavailableSchema,
    },
    detail: {
      summary: "Webhook de Polar",
      description:
        "Cuerpo raw (JSON) + cabeceras Standard Webhooks (`webhook-id`, `webhook-timestamp`, `webhook-signature`). Sin sesión de usuario.",
      tags: [openApiTags.Webhooks],
    },
  },
);
