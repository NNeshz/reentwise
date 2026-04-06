import { t } from "elysia";

/** POST /cron/payments/daily — success body (HTTP 200). */
export const cronDailySuccessResponseSchema = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  tasksExecuted: t.Number(),
  logs: t.Array(t.String()),
});

/** Auth failure (HTTP 401). */
export const cronDailyUnauthorizedSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(401),
  message: t.String(),
});

/** Handler error (HTTP 500). */
export const cronDailyErrorSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(500),
  message: t.String(),
  error: t.Optional(t.String()),
});
