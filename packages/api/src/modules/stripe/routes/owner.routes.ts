import Elysia, { status } from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { stripeModule } from "@reentwise/api/src/modules/stripe/stripe.module";
import { crearSuscripcionBodySchema } from "@reentwise/api/src/modules/stripe/stripe.schema";

export const stripeOwnerRoutes = new Elysia({
  name: "stripeOwnerRoutes",
})
  .use(betterAuthPlugin)
  .use(stripeModule)
  .post(
    "/crear-suscripcion",
    async ({ user, body, stripeService }) => {
      try {
        return await stripeService.createCheckoutSession({
          userId: user.id,
          priceId: body.priceId,
        });
      } catch {
        return status(500, "Error al crear la sesión de Stripe");
      }
    },
    {
      authenticated: true,
      body: crearSuscripcionBodySchema,
    },
  );
