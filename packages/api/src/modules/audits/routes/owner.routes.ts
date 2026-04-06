import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { auditsModule } from "@reentwise/api/src/modules/audits/audits.module";
import { getAuditsQuerySchema } from "@reentwise/api/src/modules/audits/audits.schema";
import { parseAuditsListQuery } from "@reentwise/api/src/modules/audits/utils/parse-audits-query";

export const ownerAuditsRoutes = new Elysia({
  name: "ownerAuditsRoutes",
  prefix: "/audits/owner",
})
  .use(betterAuthPlugin)
  .use(auditsModule)
  .get(
    "/",
    ({ user, query, auditsService }) => {
      const { page, limit } = parseAuditsListQuery(query);
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