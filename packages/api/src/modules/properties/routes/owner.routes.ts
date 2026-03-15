import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { propertiesModule } from "@reentwise/api/src/modules/properties/properties.module";

export const ownerPropertyRoutes = new Elysia({
  name: "ownerPropertyRoutes",
  prefix: "/properties/owner",
})
  .use(betterAuthPlugin)
  .use(propertiesModule)
  .get(
    "/",
    ({ user, propertiesService }) => {
      return propertiesService.getOwnerProperties(user.id);
    },
    {
      authenticated: true,
    },
  )
  .get(
    "/:id",
    ({ user, params, propertiesService }) => {
      return propertiesService.getPropertyById(user.id, params.id);
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    "/",
    ({ user, body, propertiesService }) => {
      return propertiesService.createProperty(user.id, body);
    },
    {
      authenticated: true,
      body: t.Object({
        name: t.String(),
        address: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:id",
    ({ user, body, params, propertiesService }) => {
      return propertiesService.updateProperty(user.id, params.id, body);
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        address: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/:id",
    ({ user, params, propertiesService }) => {
      return propertiesService.deleteProperty(user.id, params.id);
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
    },
  );
