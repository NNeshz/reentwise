import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiSuccessEnvelopeSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

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
  page: t.Optional(t.Numeric()),
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

export const paymentsListSuccessSchema = apiSuccessAnyDataSchema;

export const paymentPaySuccessSchema = apiSuccessEnvelopeSchema(t.Any());

export const paymentAnnulSuccessSchema = apiSuccessEnvelopeSchema(t.Any());

export const paymentNotFoundSchema = apiErrorEnvelopeSchema(404);

export const paymentServerErrorSchema = apiErrorEnvelopeSchema(500);
