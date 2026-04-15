import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const tenantsListQuerySchema = t.Object({
  search: t.Optional(t.String()),
  status: t.Optional(
    t.Union([
      t.Literal("pending"),
      t.Literal("partial"),
      t.Literal("paid"),
      t.Literal("late"),
      t.Literal("annulled"),
    ]),
  ),
  propertyId: t.Optional(t.String()),
  page: t.Optional(t.Number()),
});

export const tenantsAccountStatusQuerySchema = t.Object({
  month: t.Optional(t.Number()),
  year: t.Optional(t.Number()),
  search: t.Optional(t.String()),
  status: t.Optional(
    t.Union([
      t.Literal("pending"),
      t.Literal("partial"),
      t.Literal("paid"),
    ]),
  ),
});

export const tenantRoomIdParamsSchema = t.Object({
  roomId: t.String(),
});

export const tenantRoomTenantParamsSchema = t.Object({
  roomId: t.String(),
  tenantId: t.String(),
});

export const tenantIdParamsSchema = t.Object({
  tenantId: t.String(),
});

export const createTenantBodySchema = t.Object({
  name: t.String(),
  whatsapp: t.String(),
  email: t.String(),
  paymentDay: t.Number(),
  notes: t.Optional(t.String()),
});

export const assignTenantBodySchema = t.Object({
  name: t.String(),
  whatsapp: t.String(),
  email: t.String(),
  paymentDay: t.Number(),
  notes: t.Optional(t.String()),
  firstMonthRent: t.Optional(t.Number()),
  deposit: t.Optional(t.Number()),
  contractStartsAt: t.Optional(t.String({ format: "date-time" })),
  contractEndsAt: t.Optional(t.String({ format: "date-time" })),
});

export const reassignTenantBodySchema = t.Optional(
  t.Object({
    paymentDay: t.Optional(t.Number()),
  }),
);

export const updateTenantBodySchema = t.Object({
  name: t.Optional(t.String()),
  whatsapp: t.Optional(t.String()),
  email: t.Optional(t.String()),
  paymentDay: t.Optional(t.Number()),
  notes: t.Optional(t.String()),
});

export const tenantRoomIdTenantIdParamsSchema = t.Object({
  roomId: t.String(),
  id: t.String(),
});

export const tenantsSuccessSchema = apiSuccessAnyDataSchema;
export const tenantsError400Schema = apiErrorEnvelopeSchema(400);
export const tenantsError403Schema = apiErrorEnvelopeSchema(403);
export const tenantsError404Schema = apiErrorEnvelopeSchema(404);
export const tenantsError500Schema = apiErrorEnvelopeSchema(500);

export const tenantsListResponse = {
  200: tenantsSuccessSchema,
  400: tenantsError400Schema,
  403: tenantsError403Schema,
  404: tenantsError404Schema,
  500: tenantsError500Schema,
} as const;
