import { t } from "elysia";
import {
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
  listPaginationMetaSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

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

const auditRowSchema = t.Object({
  id: t.String(),
  tenantId: t.String(),
  tenantName: t.String(),
  channel: t.Union([t.Literal("email"), t.Literal("whatsapp")]),
  status: t.Union([
    t.Literal("pending"),
    t.Literal("sending"),
    t.Literal("sent"),
    t.Literal("failed"),
  ]),
  loggedAt: t.Union([t.String(), t.Date()]),
  note: t.String(),
});

const auditsListDataSchema = t.Object({
  audits: t.Array(auditRowSchema),
  count: t.Number(),
  pagination: listPaginationMetaSchema,
  failedCount: t.Number(),
});

export const auditsListSuccessSchema =
  apiSuccessEnvelopeSchema(auditsListDataSchema);

export const auditsServerErrorSchema = apiErrorEnvelopeSchema(500);
