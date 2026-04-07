import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { tenantsModule } from "@reentwise/api/src/modules/tenants/tenants.module";
import { RoomNotFoundError } from "@reentwise/api/src/modules/rooms/lib/room-not-found-error";
import {
  TenantForbiddenError,
  TenantNotFoundError,
  TenantValidationError,
} from "@reentwise/api/src/modules/tenants/lib/tenant-errors";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  tenantsListQuerySchema,
  tenantsAccountStatusQuerySchema,
  tenantRoomIdParamsSchema,
  tenantRoomTenantParamsSchema,
  tenantIdParamsSchema,
  createTenantBodySchema,
  assignTenantBodySchema,
  reassignTenantBodySchema,
  updateTenantBodySchema,
  tenantRoomIdTenantIdParamsSchema,
  tenantsSuccessSchema,
  tenantsError400Schema,
  tenantsError403Schema,
  tenantsError404Schema,
  tenantsError500Schema,
} from "@reentwise/api/src/modules/tenants/tenants.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapTenantsError(e: unknown, set: { status?: number | string }) {
  if (e instanceof TenantValidationError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  if (e instanceof TenantForbiddenError) {
    set.status = 403;
    return apiError(403, e.message);
  }
  if (e instanceof TenantNotFoundError || e instanceof RoomNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  const message =
    e instanceof Error ? e.message : "An unknown error occurred";
  set.status = 500;
  return apiError(500, message);
}

const tenantResponses = {
  200: tenantsSuccessSchema,
  400: tenantsError400Schema,
  403: tenantsError403Schema,
  404: tenantsError404Schema,
  500: tenantsError500Schema,
} as const;

export const ownerTenantsRoutes = new Elysia({
  name: "ownerTenantsRoutes",
  prefix: "/tenants/owner",
})
  .use(betterAuthPlugin)
  .use(tenantsModule)
  .get(
    "/",
    async ({ user, query, tenantsService, set }) => {
      try {
        const data = await tenantsService.getTenants(user.id, query);
        return apiSuccess("Tenants retrieved successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      query: tenantsListQuerySchema,
      response: tenantResponses,
      detail: {
        summary: "Listar inquilinos (paginado)",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .get(
    "/account-status",
    async ({ user, query, tenantsService, set }) => {
      try {
        const now = new Date();
        const data = await tenantsService.getAccountStatus(user.id, {
          month: query.month ?? now.getMonth() + 1,
          year: query.year ?? now.getFullYear(),
          search: query.search,
          status: query.status as "pending" | "partial" | "paid" | undefined,
        });
        return apiSuccess("Account status retrieved successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      query: tenantsAccountStatusQuerySchema,
      response: tenantResponses,
      detail: {
        summary: "Estado de cuenta (inquilinos y pagos del mes)",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .get(
    "/:roomId",
    async ({ params, tenantsService, set }) => {
      try {
        const data = await tenantsService.getRoomTenants(params.roomId);
        return apiSuccess("Room tenants retrieved successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomIdParamsSchema,
      response: tenantResponses,
      detail: {
        summary: "Inquilinos asignados a un cuarto",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .post(
    "/:roomId",
    async ({ params, body, tenantsService, set }) => {
      try {
        const data = await tenantsService.createTenant(params.roomId, body);
        return apiSuccess("Tenant created successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomIdParamsSchema,
      body: createTenantBodySchema,
      response: tenantResponses,
      detail: {
        summary: "Crear inquilino en un cuarto",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .post(
    "/assign/:roomId",
    async ({ params, body, tenantsService, set }) => {
      try {
        const data = await tenantsService.createAndAssignTenant(
          params.roomId,
          body,
        );
        return apiSuccess("Tenant assigned successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomIdParamsSchema,
      body: assignTenantBodySchema,
      response: tenantResponses,
      detail: {
        summary: "Crear y asignar inquilino al cuarto",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .post(
    "/reassign/:roomId/:tenantId",
    async ({ params, body, tenantsService, set }) => {
      try {
        const data = await tenantsService.reassignTenant(
          params.roomId,
          params.tenantId,
          body ?? undefined,
        );
        return apiSuccess("Tenant reassigned successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomTenantParamsSchema,
      body: reassignTenantBodySchema,
      response: tenantResponses,
      detail: {
        summary: "Reasignar inquilino a otro cuarto",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .put(
    "/unassign/:roomId/:tenantId",
    async ({ params, tenantsService, set }) => {
      try {
        const data = await tenantsService.unassignTenant(
          params.roomId,
          params.tenantId,
        );
        return apiSuccess("Tenant unassigned successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomTenantParamsSchema,
      response: tenantResponses,
      detail: {
        summary: "Desasignar inquilino del cuarto",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .put(
    "/:roomId/:id",
    async ({ params, body, tenantsService, set }) => {
      try {
        const data = await tenantsService.updateTenant(
          params.roomId,
          params.id,
          body,
        );
        return apiSuccess("Tenant updated successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomIdTenantIdParamsSchema,
      body: updateTenantBodySchema,
      response: tenantResponses,
      detail: {
        summary: "Actualizar inquilino",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .delete(
    "/by-id/:tenantId",
    async ({ params, user, tenantsService, set }) => {
      try {
        const data = await tenantsService.deleteTenantById(
          params.tenantId,
          user.id,
        );
        return apiSuccess("Tenant deleted successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantIdParamsSchema,
      response: tenantResponses,
      detail: {
        summary: "Eliminar inquilino por ID",
        description:
          "Registrado antes de `/:roomId/:id` para no capturar `by-id` como roomId.",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .delete(
    "/:roomId/:id",
    async ({ params, tenantsService, set }) => {
      try {
        const data = await tenantsService.deleteTenant(
          params.roomId,
          params.id,
        );
        return apiSuccess("Tenant deleted successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantRoomIdTenantIdParamsSchema,
      response: tenantResponses,
      detail: {
        summary: "Eliminar inquilino por cuarto e ID",
        tags: [openApiTags.Tenants],
      },
    },
  )
  .get(
    "/payments/:tenantId",
    async ({ params, user, tenantsService, set }) => {
      try {
        const data = await tenantsService.getPaymentsByTenant(
          params.tenantId,
          user.id,
        );
        return apiSuccess("Payments retrieved successfully", data);
      } catch (e) {
        return mapTenantsError(e, set);
      }
    },
    {
      authenticated: true,
      params: tenantIdParamsSchema,
      response: tenantResponses,
      detail: {
        summary: "Pagos de un inquilino",
        tags: [openApiTags.Tenants],
      },
    },
  );
