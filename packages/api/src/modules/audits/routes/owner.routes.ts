import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { auditsModule } from "@reentwise/api/src/modules/audits/audits.module";
import { getAuditsQuerySchema } from "@reentwise/api/src/modules/audits/audits.schema";

export const ownerAuditsRoutes = new Elysia({
  name: "ownerAuditsRoutes",
  prefix: "/audits/owner",
})
  .use(betterAuthPlugin)
  .use(auditsModule)
  .get(
    "/",
    ({ user, query, auditsService }) => {
      const parsedPage = query.page != null ? Number.parseInt(query.page, 10) : NaN;
      const parsedLimit =
        query.limit != null ? Number.parseInt(query.limit, 10) : NaN;
      const page = Number.isFinite(parsedPage) ? parsedPage : undefined;
      const limit = Number.isFinite(parsedLimit) ? parsedLimit : undefined;

      return auditsService.getAuditsForOwner(user.id, {
        page,
        limit,
        tenantId: query.tenantId,
        channel: query.channel,
        status: query.status,
      });
    },
    {
      authenticated: true,
      query: getAuditsQuerySchema,
    },
  );