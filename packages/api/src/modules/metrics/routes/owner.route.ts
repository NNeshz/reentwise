import Elysia, { status, t } from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import {
  MetricsQueryError,
  metricsService,
} from "@reentwise/api/src/modules/metrics/metrics.service";
import type { MetricsCardsQuery } from "@reentwise/api/src/modules/metrics/types/metrics.types";

const presetSchema = t.Union([
  t.Literal("today"),
  t.Literal("yesterday"),
  t.Literal("last_3_days"),
  t.Literal("last_7_days"),
  t.Literal("last_15_days"),
  t.Literal("last_30_days"),
  t.Literal("last_60_days"),
]);

export const ownerMetricsRoutes = new Elysia({
  name: "ownerMetricsRoutes",
  prefix: "/metrics/owner",
})
  .use(betterAuthPlugin)
  .get(
    "/cards",
    ({ user, query }) => {
      const q: MetricsCardsQuery = {
        preset: query.preset,
        from: query.from,
        to: query.to,
      };
      try {
        return metricsService.getCardsMetrics(user.id, q);
      } catch (e) {
        if (e instanceof MetricsQueryError) {
          return status(400, e.message);
        }
        throw e;
      }
    },
    {
      authenticated: true,
      query: t.Object({
        preset: t.Optional(presetSchema),
        from: t.Optional(
          t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
        ),
        to: t.Optional(
          t.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
        ),
      }),
    },
  );
