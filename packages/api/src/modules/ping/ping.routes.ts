import { Elysia } from "elysia";
import { pingModule } from "@reentwise/api/src/modules/ping/ping.module";
import {
  pingSuccessSchema,
  pingFailureSchema,
} from "@reentwise/api/src/modules/ping/ping.schema";

export const pingRoutes = new Elysia({
  name: "pingRoutes",
  prefix: "/ping",
})
  .use(pingModule)
  .get(
    "/",
    async ({ pingService, set }) => {
      const result = await pingService.ping();
      if (!result.ok) {
        set.status = 503;
        return {
          success: false as const,
          status: 503 as const,
          message: "Database unreachable",
          error: result.error,
        };
      }
      return {
        success: true as const,
        status: 200 as const,
        message: "reentwise is running",
        data: { now: result.now },
      };
    },
    {
      response: {
        200: pingSuccessSchema,
        503: pingFailureSchema,
      },
    },
  );
