import { t } from "elysia";

export const metricsCardsPresetSchema = t.Union([
  t.Literal("today"),
  t.Literal("yesterday"),
  t.Literal("last_3_days"),
  t.Literal("last_7_days"),
  t.Literal("last_15_days"),
  t.Literal("last_30_days"),
  t.Literal("last_60_days"),
]);

export const metricsCardsQuerySchema = t.Object({
  preset: t.Optional(metricsCardsPresetSchema),
  from: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  to: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
});

const metricCardIdSchema = t.Union([
  t.Literal("totalCollected"),
  t.Literal("collectionRate"),
  t.Literal("occupancyRate"),
  t.Literal("outstandingBalance"),
]);

const metricCardSchema = t.Object({
  id: metricCardIdSchema,
  value: t.Number(),
  previousValue: t.Union([t.Number(), t.Null()]),
  changePercent: t.Union([t.Number(), t.Null()]),
  format: t.Union([t.Literal("currency"), t.Literal("percent")]),
});

const metricsDateRangeSchema = t.Object({
  from: t.String(),
  to: t.String(),
});

const metricsCardsPayloadSchema = t.Object({
  preset: t.Union([metricsCardsPresetSchema, t.Null()]),
  currentRange: metricsDateRangeSchema,
  previousRange: metricsDateRangeSchema,
  daysInPeriod: t.Number(),
  cards: t.Object({
    totalCollected: metricCardSchema,
    collectionRate: metricCardSchema,
    occupancyRate: metricCardSchema,
    outstandingBalance: metricCardSchema,
  }),
});

export const metricsCardsSuccessSchema = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: metricsCardsPayloadSchema,
});

export const metricsCardsBadRequestSchema = t.Object({
  success: t.Literal(false),
  status: t.Literal(400),
  message: t.String(),
});
