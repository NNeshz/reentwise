import { t } from "elysia";

/** Query string params llegan como string; `page`/`limit` se parsean en la ruta. */
export const getAuditsQuerySchema = t.Object({
  page: t.Optional(t.String()),
  limit: t.Optional(t.String()),
  tenantId: t.Optional(t.String()),
  channel: t.Optional(
    t.Union([t.Literal("email"), t.Literal("whatsapp")]),
  ),
  status: t.Optional(
    t.Union([
      t.Literal("pending"),
      t.Literal("sending"),
      t.Literal("sent"),
      t.Literal("failed"),
    ]),
  ),
});
