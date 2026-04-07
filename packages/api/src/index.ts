import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import "./utils/envs";
import { env } from "@reentwise/api/src/utils/envs";

import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { openApiDocumentation } from "@reentwise/api/src/utils/openapi-meta";

import { pingRoutes } from "@reentwise/api/src/modules/ping/ping.routes";

import { ownerMetricsRoutes } from "@reentwise/api/src/modules/metrics/metrics.routes";
import { ownerPropertyRoutes } from "@reentwise/api/src/modules/properties/properties.routes";
import { ownerRoomsRoutes } from "@reentwise/api/src/modules/rooms/rooms.routes";
import { ownerTenantsRoutes } from "@reentwise/api/src/modules/tenants/tenants.routes";
import { ownerPaymentsRoutes } from "@reentwise/api/src/modules/payments/payments.routes";
import { ownerAuditsRoutes } from "@reentwise/api/src/modules/audits/audits.routes";
import { cronPaymentsRoutes } from "@reentwise/api/src/modules/cron/cron.routes";
import { stripeRoutes } from "@reentwise/api/src/modules/stripe/stripe.routes";
import { emailRoutes } from "@reentwise/api/src/modules/email/email.routes";

const allowedOrigins = [
  env.NEXT_PUBLIC_FRONTEND_URL,
  env.NEXT_PUBLIC_FRONTEND_WWW,
].filter((origin): origin is string => Boolean(origin));

export const api = new Elysia({
  prefix: "/api",
})
  .use(betterAuthPlugin)
  .use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    }),
  )
  .use(cronPaymentsRoutes)
  .use(stripeRoutes)
  .use(emailRoutes)
  .use(pingRoutes)
  .use(ownerPropertyRoutes)
  .use(ownerRoomsRoutes)
  .use(ownerTenantsRoutes)
  .use(ownerPaymentsRoutes)
  .use(ownerAuditsRoutes)
  .use(ownerMetricsRoutes)
  .use(
    openapi({
      path: "/openapi",
      documentation: openApiDocumentation,
      exclude: {
        /** Better Auth monta su propio handler; rutas `/api/auth/*` vienen del mount. */
        paths: [/\/api\/auth\b/],
      },
    }),
  );

export type Api = typeof api;
