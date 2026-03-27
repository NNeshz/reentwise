import { api } from "@reentwise/api/src";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

const port = Number(process.env.PORT) || 8080;

const app = new Elysia()
  .use(api)
  .use(
    openapi({
      path: "/openapi",
    })
  )
  .listen({ port, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);