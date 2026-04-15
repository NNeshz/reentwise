import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const expenseIdParamsSchema = t.Object({
  expenseId: t.String(),
});

export const createExpenseBodySchema = t.Object({
  propertyId: t.Optional(t.String()),
  roomId: t.Optional(t.String()),
  category: t.Union([
    t.Literal("maintenance"),
    t.Literal("repair"),
    t.Literal("tax"),
    t.Literal("insurance"),
    t.Literal("utility"),
    t.Literal("administration"),
    t.Literal("other"),
  ]),
  amount: t.String(),
  description: t.Optional(t.String()),
  vendor: t.Optional(t.String()),
  receiptUrl: t.Optional(t.String()),
  incurredAt: t.Optional(t.String({ format: "date-time" })),
});

export const updateExpenseBodySchema = t.Partial(createExpenseBodySchema);

export const expensesSuccessSchema = apiSuccessAnyDataSchema;
export const expensesError404Schema = apiErrorEnvelopeSchema(404);
export const expensesError500Schema = apiErrorEnvelopeSchema(500);
