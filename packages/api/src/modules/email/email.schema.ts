import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

/** POST /email/webhook — verified and handled. */
export const emailWebhookSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    received: t.Literal(true),
  }),
);

export const emailWebhookBadRequestSchema = apiErrorEnvelopeSchema(400);

export const emailWebhookServerErrorSchema = apiErrorEnvelopeSchema(500);
