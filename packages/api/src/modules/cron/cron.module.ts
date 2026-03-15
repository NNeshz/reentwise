import Elysia from "elysia";
import { cronService } from "@reentwise/api/src/modules/cron/cron.service";

export const cronModule = new Elysia({
  name: "cronModule",
}).decorate({
  cronService,
});
