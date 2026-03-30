import Elysia from "elysia";
import { metricsService } from "@reentwise/api/src/modules/metrics/metrics.service";

export const metricsModule = new Elysia({
  name: "metricsModule",
}).decorate({
  metricsService,
});
