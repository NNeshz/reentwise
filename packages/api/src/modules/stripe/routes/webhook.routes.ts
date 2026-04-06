import Elysia, { status } from "elysia";
import type Stripe from "stripe";
import { env } from "@reentwise/api/src/utils/envs";
import { StripeNotConfiguredError } from "@reentwise/api/src/modules/stripe/lib/stripe-not-configured-error";
import {
  constructStripeWebhookEvent,
  stripeService,
} from "@reentwise/api/src/modules/stripe/stripe.service";

export const stripeWebhookRoutes = new Elysia({
  name: "stripeWebhookRoutes",
}).post("/webhook", async ({ body, request }) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return status(400, "Missing stripe-signature");
  }
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return status(503, "STRIPE_WEBHOOK_SECRET no configurada");
  }

  let event: Stripe.Event;
  try {
    event = constructStripeWebhookEvent(body as string, signature, secret);
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return status(503, err.message);
    }
    const message = err instanceof Error ? err.message : String(err);
    return status(400, `Webhook Error: ${message}`);
  }

  try {
    await stripeService.handleWebhookEvent(event);
  } catch (e) {
    console.error("[Stripe] webhook handler error:", e);
    return status(500, "Webhook processing failed");
  }

  return { received: true as const };
});
