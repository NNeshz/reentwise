import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const pingSuccessSchema = apiSuccessEnvelopeSchema(
  t.Object({
    now: t.Optional(t.Any()),
  }),
);

export const pingFailureSchema = apiErrorEnvelopeSchema(503);
