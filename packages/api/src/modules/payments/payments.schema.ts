import { t } from "elysia";

export const getPaymentsQuerySchema = t.Optional(
  t.Object({
    month: t.Optional(t.String()),
    year: t.Optional(t.String()),
    search: t.Optional(t.String()),
    status: t.Optional(
      t.Union([
        t.Literal("pending"),
        t.Literal("partial"),
        t.Literal("paid"),
      ]),
    ),
  }),
);

export const payPaymentBodySchema = t.Object({
  paymentAmount: t.Number(),
  method: t.Union([
    t.Literal("cash"),
    t.Literal("transfer"),
    t.Literal("deposit"),
  ]),
});

export const paymentIdParamsSchema = t.Object({
  id: t.String(),
});
