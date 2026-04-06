import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

/** POST /cron/payments/daily — success body (HTTP 200). */
export const cronDailySuccessResponseSchema = apiSuccessEnvelopeSchema(
  t.Object({
    tasksExecuted: t.Number(),
    logs: t.Array(t.String()),
  }),
);

/** Auth failure (HTTP 401). */
export const cronDailyUnauthorizedSchema = apiErrorEnvelopeSchema(401);

/** Handler error (HTTP 500). */
export const cronDailyErrorSchema = apiErrorEnvelopeSchema(500);
