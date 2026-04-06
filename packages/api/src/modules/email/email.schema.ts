import { t } from "elysia";

/** POST /email/webhook — verified and handled. */
export const emailWebhookSuccessSchema = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  received: t.Literal(true),
});

export const emailWebhookBadRequestSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(400),
  message: t.String(),
});

export const emailWebhookServerErrorSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(500),
  message: t.String(),
});
