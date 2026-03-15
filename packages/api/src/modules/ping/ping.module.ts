import { Elysia } from "elysia";
import { pingService } from "@reentwise/api/src/modules/ping/ping.service";

export const pingModule = new Elysia({
  name: "pingModule",
}).decorate({
  pingService,
});
