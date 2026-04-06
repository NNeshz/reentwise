import { t } from "elysia";

const envelopeOk = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Any(),
});

const err = (code: number) =>
  t.Object({
    success: t.Literal(false),
    status: t.Literal(code),
    message: t.String(),
  });

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

export const tenantsSuccessSchema = envelopeOk;
export const tenantsError400Schema = err(400);
export const tenantsError403Schema = err(403);
export const tenantsError404Schema = err(404);
export const tenantsError500Schema = err(500);

export const tenantsListResponse = {
  200: tenantsSuccessSchema,
  400: tenantsError400Schema,
  403: tenantsError403Schema,
  404: tenantsError404Schema,
  500: tenantsError500Schema,
} as const;
