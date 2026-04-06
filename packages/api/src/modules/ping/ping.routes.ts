import { Elysia } from "elysia";
import { pingModule } from "@reentwise/api/src/modules/ping/ping.module";
import {
  pingSuccessSchema,
  pingFailureSchema,
} from "@reentwise/api/src/modules/ping/ping.schema";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";

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
        return apiError(503, result.error ?? "Database unreachable");
      }
      return apiSuccess("reentwise is running", { now: result.now });
    },
    {
      response: {
        200: pingSuccessSchema,
        503: pingFailureSchema,
      },
    },
  );
