import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { tenantsModule } from "@reentwise/api/src/modules/tenants/tenants.module";

export const ownerTenantsRoutes = new Elysia({
  name: "ownerTenantsRoutes",
  prefix: "/tenants/owner",
})
  .use(betterAuthPlugin)
  .use(tenantsModule)
  .get(
    "/",
    ({ user, query, tenantsService }) => {
      return tenantsService.getTenants(user.id, query);
    },
    {
      authenticated: true,
      query: t.Object({
        search: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal("pending"),
            t.Literal("partial"),
            t.Literal("paid"),
            t.Literal("late"),
            t.Literal("annulled"),
          ]),
        ),
        propertyId: t.Optional(t.String()),
        page: t.Optional(t.Number()),
      })
    },
  )
  .get(
    "/account-status",
    ({ user, query, tenantsService }) => {
      const now = new Date();
      return tenantsService.getAccountStatus(user.id, {
        month: query.month ?? now.getMonth() + 1,
        year: query.year ?? now.getFullYear(),
        search: query.search,
        status: query.status as "pending" | "partial" | "paid" | undefined,
      });
    },
    {
      authenticated: true,
      query: t.Object({
        month: t.Optional(t.Number()),
        year: t.Optional(t.Number()),
        search: t.Optional(t.String()),
        status: t.Optional(
          t.Union([
            t.Literal("pending"),
            t.Literal("partial"),
            t.Literal("paid"),
          ]),
        ),
      }),
    },
  )
  .get(
    "/:roomId",
    ({ params, tenantsService }) => {
      return tenantsService.getRoomTenants(params.roomId);
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
      }),
    },
  )
  .post(
    "/:roomId",
    ({ params, body, tenantsService }) => {
      return tenantsService.createTenant(params.roomId, body);
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        whatsapp: t.String(),
        email: t.String(),
        paymentDay: t.Number(),
        notes: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/assign/:roomId",
    ({ params, body, tenantsService }) => {
      return tenantsService.createAndAssignTenant(params.roomId, body);
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        whatsapp: t.String(),
        email: t.String(),
        paymentDay: t.Number(),
        notes: t.Optional(t.String()),
        firstMonthRent: t.Optional(t.Number()),
        deposit: t.Optional(t.Number()),
      }),
    },
  )
  .post(
    "/reassign/:roomId/:tenantId",
    ({ params, body, tenantsService }) => {
      return tenantsService.reassignTenant(
        params.roomId,
        params.tenantId,
        body ?? undefined,
      );
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
        tenantId: t.String(),
      }),
      body: t.Optional(
        t.Object({
          paymentDay: t.Optional(t.Number()),
        }),
      ),
    },
  )
  .put(
    "/unassign/:roomId/:tenantId",
    async ({ params, tenantsService, set }) => {
      const result = await tenantsService.unassignTenant(
        params.roomId,
        params.tenantId,
      );
      if (result && "status" in result && result.status >= 400) {
        set.status = result.status;
      }
      return result;
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
        tenantId: t.String(),
      }),
    },
  )
  .put(
    "/:roomId/:id",
    ({ params, body, tenantsService }) => {
      return tenantsService.updateTenant(params.roomId, params.id, body);
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        whatsapp: t.Optional(t.String()),
        email: t.Optional(t.String()),
        paymentDay: t.Optional(t.Number()),
        notes: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/:roomId/:id",
    ({ params, tenantsService }) => {
      return tenantsService.deleteTenant(params.roomId, params.id);
    },
    {
      authenticated: true,
      params: t.Object({
        roomId: t.String(),
        id: t.String(),
      }),
    },
  );
