import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { metricsModule } from "@reentwise/api/src/modules/metrics/metrics.module";
import { MetricsQueryError } from "@reentwise/api/src/modules/metrics/lib/metrics-query-error";
import type { MetricsCardsQuery } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import {
  metricsCardsQuerySchema,
  metricsCardsSuccessSchema,
  metricsCardsBadRequestSchema,
  metricsCardsServerErrorSchema,
} from "@reentwise/api/src/modules/metrics/metrics.schema";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";

function mapMetricsRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof MetricsQueryError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error al obtener las métricas";
  set.status = 500;
  return apiError(500, message);
}

export const ownerMetricsRoutes = new Elysia({
  name: "ownerMetricsRoutes",
  prefix: "/metrics/owner",
})
  .use(betterAuthPlugin)
  .use(metricsModule)
  .get(
    "/cards",
    async ({ user, query, metricsService, set }) => {
      const q: MetricsCardsQuery = {
        preset: query.preset,
        from: query.from,
        to: query.to,
      };
      try {
        const data = await metricsService.getCardsMetrics(user.id, q);
        return apiSuccess("Metrics retrieved successfully", data);
      } catch (e) {
        return mapMetricsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      query: metricsCardsQuerySchema,
      response: {
        200: metricsCardsSuccessSchema,
        400: metricsCardsBadRequestSchema,
        500: metricsCardsServerErrorSchema,
      },
    },
  );
