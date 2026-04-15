import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { settingsModule } from "@reentwise/api/src/modules/settings/settings.module";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import { OwnerProfileNotFoundError } from "@reentwise/api/src/modules/settings/lib/owner-profile-not-found-error";
import { EmptyProfilePatchError } from "@reentwise/api/src/modules/settings/lib/empty-profile-patch-error";
import {
  patchOwnerProfileBodySchema,
  ownerProfileGetSuccessSchema,
  ownerProfilePatchSuccessSchema,
  ownerProfileNotFoundSchema,
  ownerProfileBadRequestSchema,
  ownerProfileServerErrorSchema,
} from "@reentwise/api/src/modules/settings/settings.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapSettingsRouteError(e: unknown, set: { status?: number | string }) {
  if (e instanceof OwnerProfileNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  if (e instanceof EmptyProfilePatchError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  const message =
    e instanceof Error ? e.message : "An unknown error occurred";
  set.status = 500;
  return apiError(500, message);
}

export const ownerSettingsRoutes = new Elysia({
  name: "ownerSettingsRoutes",
  prefix: "/settings/owner",
})
  .use(betterAuthPlugin)
  .use(settingsModule)
  .get(
    "/profile",
    async ({ user, settingsService, set }) => {
      try {
        set.headers["Cache-Control"] = "private, no-store, max-age=0";
        const data = await settingsService.getOwnerProfile(user.id);
        return apiSuccess("Profile settings retrieved successfully", data);
      } catch (e) {
        return mapSettingsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      response: {
        200: ownerProfileGetSuccessSchema,
        404: ownerProfileNotFoundSchema,
        500: ownerProfileServerErrorSchema,
      },
      detail: {
        summary: "Obtener ajustes de perfil del propietario",
        tags: [openApiTags.Settings],
      },
    },
  )
  .patch(
    "/profile",
    async ({ user, body, settingsService, set }) => {
      try {
        const data = await settingsService.patchOwnerProfile(user.id, body);
        return apiSuccess("Profile settings updated successfully", data);
      } catch (e) {
        return mapSettingsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      body: patchOwnerProfileBodySchema,
      response: {
        200: ownerProfilePatchSuccessSchema,
        400: ownerProfileBadRequestSchema,
        404: ownerProfileNotFoundSchema,
        500: ownerProfileServerErrorSchema,
      },
      detail: {
        summary: "Actualizar ajustes de perfil del propietario",
        tags: [openApiTags.Settings],
      },
    },
  );
