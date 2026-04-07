import Elysia from "elysia";
import Stripe from "stripe";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { stripeModule } from "@reentwise/api/src/modules/stripe/stripe.module";
import { StripeNotConfiguredError } from "@reentwise/api/src/modules/stripe/lib/stripe-not-configured-error";
import { InvalidStripePriceError } from "@reentwise/api/src/modules/stripe/lib/invalid-stripe-price-error";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  stripeCreateCheckoutBodySchema,
  stripeCheckoutSuccessSchema,
  stripeBadRequestSchema,
  stripeBadGatewaySchema,
  stripeServiceUnavailableSchema,
  stripeServerErrorSchema,
} from "@reentwise/api/src/modules/stripe/stripe.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapStripeOwnerError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof InvalidStripePriceError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  if (e instanceof StripeNotConfiguredError) {
    set.status = 503;
    return apiError(503, e.message);
  }
  if (e instanceof Stripe.errors.StripeError) {
    set.status = 502;
    return apiError(502, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error al crear la sesión de Stripe";
  set.status = 500;
  return apiError(500, message);
}

export const stripeOwnerRoutes = new Elysia({
  name: "stripeOwnerRoutes",
})
  .use(betterAuthPlugin)
  .use(stripeModule)
  .post(
    "/crear-suscripcion",
    async ({ user, body, stripeService, set }) => {
      try {
        const data = await stripeService.createCheckoutSession({
          userId: user.id,
          priceId: body.priceId,
        });
        return apiSuccess("Sesión de checkout creada", data);
      } catch (e) {
        return mapStripeOwnerError(e, set);
      }
    },
    {
      authenticated: true,
      body: stripeCreateCheckoutBodySchema,
      response: {
        200: stripeCheckoutSuccessSchema,
        400: stripeBadRequestSchema,
        500: stripeServerErrorSchema,
        502: stripeBadGatewaySchema,
        503: stripeServiceUnavailableSchema,
      },
      detail: {
        summary: "Crear sesión de Checkout (suscripción)",
        description:
          "Devuelve `data.url` al hosted checkout de Stripe. `priceId` debe coincidir con precios configurados en el servidor.",
        tags: [openApiTags.Stripe],
      },
    },
  );
