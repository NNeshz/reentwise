import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { auditsModule } from "@reentwise/api/src/modules/audits/audits.module";
import {
  getAuditsQuerySchema,
  auditsListSuccessSchema,
  auditsServerErrorSchema,
} from "@reentwise/api/src/modules/audits/audits.schema";
import { parseAuditsListQuery } from "@reentwise/api/src/modules/audits/utils/parse-audits-query";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapAuditsRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  const message =
    e instanceof Error ? e.message : "Error al obtener las auditorías";
  set.status = 500;
  return apiError(500, message);
}

export const ownerAuditsRoutes = new Elysia({
  name: "ownerAuditsRoutes",
  prefix: "/audits/owner",
})
  .use(betterAuthPlugin)
  .use(auditsModule)
  .get(
    "/",
    async ({ user, query, auditsService, set }) => {
      try {
        const { page, limit } = parseAuditsListQuery(query);
        const data = await auditsService.getAuditsForOwner(user.id, {
          page,
          limit,
          tenantId: query.tenantId,
          channel: query.channel,
          status: query.status,
        });
        return apiSuccess("Audits retrieved successfully", data);
      } catch (e) {
        return mapAuditsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      query: getAuditsQuerySchema,
      response: {
        200: auditsListSuccessSchema,
        500: auditsServerErrorSchema,
      },
      detail: {
        summary: "Listar auditorías de envío",
        description: "Filtros opcionales: tenant, canal, estado.",
        tags: [openApiTags.Audits],
      },
    },
  );
