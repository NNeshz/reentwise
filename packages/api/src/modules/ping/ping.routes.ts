import { Elysia } from "elysia";
import { pingModule } from "@reentwise/api/src/modules/ping/ping.module";

export const pingRoutes = new Elysia({
  name: "pingRoutes",
  prefix: "/ping",
})
.use(pingModule)
.get("/", ({ pingService }) => {
  return pingService.ping();
});
