import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

/** UUID del producto de suscripción en Polar (`POLAR_PRODUCT_*` en servidor). */
export const billingCreateCheckoutBodySchema = t.Object({
  productId: t.String(),
});

export const billingCheckoutSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    url: t.String(),
  }),
);

export const billingBadRequestSchema = apiErrorEnvelopeSchema(400);
export const billingConflictSchema = apiErrorEnvelopeSchema(409);
export const billingServiceUnavailableSchema = apiErrorEnvelopeSchema(503);
export const billingServerErrorSchema = apiErrorEnvelopeSchema(500);

export const billingWebhookSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    received: t.Literal(true),
  }),
);

export const billingWebhookBadRequestSchema = apiErrorEnvelopeSchema(400);
export const billingWebhookServerErrorSchema = apiErrorEnvelopeSchema(500);
export const billingWebhookServiceUnavailableSchema =
  apiErrorEnvelopeSchema(503);
