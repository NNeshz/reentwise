import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { metricsModule } from "@reentwise/api/src/modules/metrics/metrics.module";
import { MetricsQueryError } from "@reentwise/api/src/modules/metrics/lib/metrics-query-error";
import type { MetricsCardsQuery } from "@reentwise/api/src/modules/metrics/types/metrics.types";
import {
  metricsCardsQuerySchema,
  metricsCardsSuccessSchema,
  metricsCardsBadRequestSchema,
} from "@reentwise/api/src/modules/metrics/metrics.schema";

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
        return {
          success: true as const,
          status: 200 as const,
          message: "Metrics retrieved successfully",
          data,
        };
      } catch (e) {
        if (e instanceof MetricsQueryError) {
          set.status = 400;
          return {
            success: false as const,
            status: 400 as const,
            message: e.message,
          };
        }
        throw e;
      }
    },
    {
      authenticated: true,
      query: metricsCardsQuerySchema,
      response: {
        200: metricsCardsSuccessSchema,
        400: metricsCardsBadRequestSchema,
      },
    },
  );
