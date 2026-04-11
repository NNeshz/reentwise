import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { billingModule } from "@reentwise/api/src/modules/billing/billing.module";
import { BillingActivePolarSubscriptionError } from "@reentwise/api/src/modules/billing/lib/billing-active-polar-subscription-error";
import { BillingNotConfiguredError } from "@reentwise/api/src/modules/billing/lib/billing-not-configured-error";
import { InvalidBillingProductError } from "@reentwise/api/src/modules/billing/lib/invalid-billing-product-error";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  billingCreateCheckoutBodySchema,
  billingCheckoutSuccessSchema,
  billingBadRequestSchema,
  billingConflictSchema,
  billingServiceUnavailableSchema,
  billingServerErrorSchema,
} from "@reentwise/api/src/modules/billing/billing.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

function mapBillingOwnerError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof InvalidBillingProductError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  if (e instanceof BillingActivePolarSubscriptionError) {
    set.status = 409;
    return apiError(409, e.message);
  }
  if (e instanceof BillingNotConfiguredError) {
    set.status = 503;
    return apiError(503, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error al crear la sesión de checkout";
  set.status = 500;
  return apiError(500, message);
}

export const billingOwnerRoutes = new Elysia({
  name: "billingOwnerRoutes",
})
  .use(betterAuthPlugin)
  .use(billingModule)
  .post(
    "/crear-suscripcion",
    async ({ user, body, billingService, set }) => {
      try {
        const data = await billingService.createCheckoutSession({
          userId: user.id,
          productId: body.productId,
        });
        return apiSuccess("Sesión de checkout creada", data);
      } catch (e) {
        return mapBillingOwnerError(e, set);
      }
    },
    {
      authenticated: true,
      body: billingCreateCheckoutBodySchema,
      response: {
        200: billingCheckoutSuccessSchema,
        400: billingBadRequestSchema,
        409: billingConflictSchema,
        500: billingServerErrorSchema,
        503: billingServiceUnavailableSchema,
      },
      detail: {
        summary: "Crear sesión de checkout (Polar)",
        description:
          "Devuelve `data.url` al checkout alojado en Polar. `productId` debe coincidir con `POLAR_PRODUCT_*` en el servidor.",
        tags: [openApiTags.Billing],
      },
    },
  )
  .get(
    "/plan",
    async ({ user, set }) => {
      const data = await planLimitsService.getOwnerPlanReadModel(user.id);
      if (!data) {
        set.status = 404;
        return apiError(404, "No se pudo resolver el plan del usuario");
      }
      return apiSuccess("Plan y uso actual", data);
    },
    {
      authenticated: true,
      response: {
        200: apiSuccessAnyDataSchema,
        404: apiErrorEnvelopeSchema(404),
      },
      detail: {
        summary: "Plan, límites y uso (solo lectura)",
        description:
          "Tier efectivo, límites de `plan_limits` y conteos activos (sin propiedades ni cuartos archivados).",
        tags: [openApiTags.Billing],
      },
    },
  );
