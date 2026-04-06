import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const stripeCreateCheckoutBodySchema = t.Object({
  priceId: t.String(),
});

/** @deprecated Use stripeCreateCheckoutBodySchema — mismo esquema. */
export const crearSuscripcionBodySchema = stripeCreateCheckoutBodySchema;

export const stripeCheckoutSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    url: t.String(),
  }),
);

export const stripeBadRequestSchema = apiErrorEnvelopeSchema(400);
export const stripeBadGatewaySchema = apiErrorEnvelopeSchema(502);
export const stripeServiceUnavailableSchema = apiErrorEnvelopeSchema(503);
export const stripeServerErrorSchema = apiErrorEnvelopeSchema(500);

/** Stripe webhook — success (HTTP 200). */
export const stripeWebhookSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    received: t.Literal(true),
  }),
);

export const stripeWebhookBadRequestSchema = apiErrorEnvelopeSchema(400);
export const stripeWebhookServerErrorSchema = apiErrorEnvelopeSchema(500);
export const stripeWebhookServiceUnavailableSchema =
  apiErrorEnvelopeSchema(503);
