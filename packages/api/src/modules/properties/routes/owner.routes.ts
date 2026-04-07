import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { propertiesModule } from "@reentwise/api/src/modules/properties/properties.module";
import { PlanLimitExceededError } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { PropertyNotFoundError } from "@reentwise/api/src/modules/properties/lib/property-not-found-error";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  propertyIdParamsSchema,
  createPropertyBodySchema,
  updatePropertyBodySchema,
  propertiesListSuccessSchema,
  propertyOneSuccessSchema,
  propertyMutationSuccessSchema,
  propertyNotFoundSchema,
  propertyPlanLimitSchema,
  propertyServerErrorSchema,
} from "@reentwise/api/src/modules/properties/properties.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapPropertyRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof PropertyNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  if (e instanceof PlanLimitExceededError) {
    set.status = 402;
    return apiError(402, e.message);
  }
  const message =
    e instanceof Error ? e.message : "An unknown error occurred";
  set.status = 500;
  return apiError(500, message);
}

export const ownerPropertyRoutes = new Elysia({
  name: "ownerPropertyRoutes",
  prefix: "/properties/owner",
})
  .use(betterAuthPlugin)
  .use(propertiesModule)
  .get(
    "/",
    async ({ user, propertiesService, set }) => {
      try {
        const data = await propertiesService.getOwnerProperties(user.id);
        return apiSuccess("Properties retrieved successfully", data);
      } catch (e) {
        return mapPropertyRouteError(e, set);
      }
    },
    {
      authenticated: true,
      response: {
        200: propertiesListSuccessSchema,
        500: propertyServerErrorSchema,
      },
      detail: {
        summary: "Listar propiedades",
        description:
          "Propiedades del usuario con conteo de cuartos. Requiere sesión.",
        tags: [openApiTags.Properties],
      },
    },
  )
  .get(
    "/:id",
    async ({ user, params, propertiesService, set }) => {
      try {
        const data = await propertiesService.getPropertyById(
          user.id,
          params.id,
        );
        return apiSuccess("Property retrieved successfully", data);
      } catch (e) {
        return mapPropertyRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: propertyIdParamsSchema,
      response: {
        200: propertyOneSuccessSchema,
        404: propertyNotFoundSchema,
        500: propertyServerErrorSchema,
      },
      detail: {
        summary: "Obtener propiedad por ID",
        tags: [openApiTags.Properties],
      },
    },
  )
  .post(
    "/",
    async ({ user, body, propertiesService, set }) => {
      try {
        const data = await propertiesService.createProperty(user.id, body);
        return apiSuccess("Property created successfully", data);
      } catch (e) {
        return mapPropertyRouteError(e, set);
      }
    },
    {
      authenticated: true,
      body: createPropertyBodySchema,
      response: {
        200: propertyMutationSuccessSchema,
        402: propertyPlanLimitSchema,
        500: propertyServerErrorSchema,
      },
      detail: {
        summary: "Crear propiedad",
        description: "402 si se excede el límite del plan.",
        tags: [openApiTags.Properties],
      },
    },
  )
  .put(
    "/:id",
    async ({ user, body, params, propertiesService, set }) => {
      try {
        const data = await propertiesService.updateProperty(
          user.id,
          params.id,
          body,
        );
        return apiSuccess("Property updated successfully", data);
      } catch (e) {
        return mapPropertyRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: propertyIdParamsSchema,
      body: updatePropertyBodySchema,
      response: {
        200: propertyMutationSuccessSchema,
        404: propertyNotFoundSchema,
        500: propertyServerErrorSchema,
      },
      detail: {
        summary: "Actualizar propiedad",
        tags: [openApiTags.Properties],
      },
    },
  )
  .delete(
    "/:id",
    async ({ user, params, propertiesService, set }) => {
      try {
        const data = await propertiesService.deleteProperty(
          user.id,
          params.id,
        );
        return apiSuccess("Property deleted successfully", data);
      } catch (e) {
        return mapPropertyRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: propertyIdParamsSchema,
      response: {
        200: propertyMutationSuccessSchema,
        404: propertyNotFoundSchema,
        500: propertyServerErrorSchema,
      },
      detail: {
        summary: "Eliminar propiedad",
        tags: [openApiTags.Properties],
      },
    },
  );
