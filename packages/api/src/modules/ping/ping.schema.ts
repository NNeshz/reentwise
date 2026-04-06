import { t } from "elysia";

export const pingSuccessSchema = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Object({
    now: t.Optional(t.Any()),
  }),
});

export const pingFailureSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(503),
  message: t.String(),
  error: t.String(),
});
