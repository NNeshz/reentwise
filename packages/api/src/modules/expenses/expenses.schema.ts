import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const expenseIdParamsSchema = t.Object({
  expenseId: t.String(),
});

/** Filtros opcionales para listar gastos. */
export const expensesListQuerySchema = t.Object({
  /** Fecha inicial ISO (incurredAt >= from) */
  from: t.Optional(t.String({ format: "date" })),
  /** Fecha final ISO (incurredAt <= to) — incluye todo el día */
  to: t.Optional(t.String({ format: "date" })),
  /** Año exacto (alternativa a from/to) */
  year: t.Optional(t.Numeric()),
  /** Mes exacto 1-12 (requiere year) */
  month: t.Optional(t.Numeric()),
  /** Filtrar por propiedad */
  propertyId: t.Optional(t.String()),
  /** Filtrar por categoría */
  category: t.Optional(
    t.Union([
      t.Literal("maintenance"),
      t.Literal("repair"),
      t.Literal("tax"),
      t.Literal("insurance"),
      t.Literal("utility"),
      t.Literal("administration"),
      t.Literal("other"),
    ]),
  ),
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
