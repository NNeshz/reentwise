import type { Api as server } from "@reentwise/api/src/index";
import { treaty } from "@elysiajs/eden";

export const createApiClient: (
  url: string,
) => ReturnType<typeof treaty<server>>["api"] = (url) =>
  treaty<server>(url, {
    fetch: {
      credentials: "include",
      /** Owner/session JSON must not be served from the browser HTTP cache after refresh. */
      cache: "no-store",
    },
  }).api;
