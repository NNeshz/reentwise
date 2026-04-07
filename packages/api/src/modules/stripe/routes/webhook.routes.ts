import Elysia from "elysia";
import type Stripe from "stripe";
import { env } from "@reentwise/api/src/utils/envs";
import { StripeNotConfiguredError } from "@reentwise/api/src/modules/stripe/lib/stripe-not-configured-error";
import {
  constructStripeWebhookEvent,
  stripeService,
} from "@reentwise/api/src/modules/stripe/stripe.service";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  stripeWebhookSuccessSchema,
  stripeWebhookBadRequestSchema,
  stripeWebhookServerErrorSchema,
  stripeWebhookServiceUnavailableSchema,
} from "@reentwise/api/src/modules/stripe/stripe.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

export const stripeWebhookRoutes = new Elysia({
  name: "stripeWebhookRoutes",
}).post(
  "/webhook",
  async ({ body, request, set }) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      set.status = 400;
      return apiError(400, "Missing stripe-signature");
    }
    const secret = env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      set.status = 503;
      return apiError(503, "STRIPE_WEBHOOK_SECRET no configurada");
    }

    let event: Stripe.Event;
    try {
      event = constructStripeWebhookEvent(body as string, signature, secret);
    } catch (err) {
      if (err instanceof StripeNotConfiguredError) {
        set.status = 503;
        return apiError(503, err.message);
      }
      const message = err instanceof Error ? err.message : String(err);
      set.status = 400;
      return apiError(400, `Webhook Error: ${message}`);
    }

    try {
      await stripeService.handleWebhookEvent(event);
    } catch (e) {
      console.error("[Stripe] webhook handler error:", e);
      set.status = 500;
      return apiError(500, "Webhook processing failed");
    }

    return apiSuccess("Event received", { received: true as const });
  },
  {
    response: {
      200: stripeWebhookSuccessSchema,
      400: stripeWebhookBadRequestSchema,
      500: stripeWebhookServerErrorSchema,
      503: stripeWebhookServiceUnavailableSchema,
    },
    detail: {
      summary: "Webhook de Stripe",
      description:
        "Cuerpo raw + cabecera `stripe-signature`. No usar sesión de usuario.",
      tags: [openApiTags.Webhooks],
    },
  },
);
