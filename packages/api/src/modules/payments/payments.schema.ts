import { t } from "elysia";

export const getPaymentsQuerySchema = t.Object({
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
});

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

const paymentListEnvelope = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Array(t.Any()),
});

const paymentRowEnvelope = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Any(),
});

export const paymentsListSuccessSchema = paymentListEnvelope;
export const paymentPaySuccessSchema = paymentRowEnvelope;
export const paymentAnnulSuccessSchema = paymentRowEnvelope;

export const paymentNotFoundSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(404),
  message: t.String(),
});
