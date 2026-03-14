import { api } from "@reentwise/api/src";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(api)
  .use(
    openapi({
      path: "/openapi",
    })
  )
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);