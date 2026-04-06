import { t } from "elysia";

/** Query strings; `page` / `limit` parsed in route via `parseAuditsListQuery`. */
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
