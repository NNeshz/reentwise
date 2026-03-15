import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "./utils/envs";

import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";

import { pingRoutes } from "@reentwise/api/src/modules/ping/ping.routes";

import { ownerPropertyRoutes } from "@reentwise/api/src/modules/properties/properties.routes";
import { ownerRoomsRoutes } from "@reentwise/api/src/modules/rooms/rooms.routes";
import { ownerTenantsRoutes } from "@reentwise/api/src/modules/tenants/tenants.routes";
import { ownerPaymentsRoutes } from "@reentwise/api/src/modules/payments/payments.routes";
import { cronPaymentsRoutes } from "@reentwise/api/src/modules/cron/cron.routes";

export const api = new Elysia({
  prefix: "/api",
})
  .use(betterAuthPlugin)
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    }),
  )
  .use(cronPaymentsRoutes)
  .use(pingRoutes)
  .use(ownerPropertyRoutes)
  .use(ownerRoomsRoutes)
  .use(ownerTenantsRoutes)
  .use(ownerPaymentsRoutes)

export type Api = typeof api;
