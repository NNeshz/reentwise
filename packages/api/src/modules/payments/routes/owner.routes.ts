import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { paymentsModule } from "@reentwise/api/src/modules/payments/payments.module";
import { PaymentNotFoundError } from "@reentwise/api/src/modules/payments/lib/payment-not-found-error";
import { parsePaymentsListQuery } from "@reentwise/api/src/modules/payments/utils/parse-payments-list-query";
import type { PaymentStatusFilter } from "@reentwise/api/src/modules/payments/types/payments.types";
import {
  getPaymentsQuerySchema,
  payPaymentBodySchema,
  paymentIdParamsSchema,
  paymentsListSuccessSchema,
  paymentPaySuccessSchema,
  paymentAnnulSuccessSchema,
  paymentNotFoundSchema,
  paymentServerErrorSchema,
} from "@reentwise/api/src/modules/payments/payments.schema";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";

function mapPaymentsRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof PaymentNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error al procesar el pago";
  set.status = 500;
  return apiError(500, message);
}

export const ownerPaymentsRoutes = new Elysia({
  name: "ownerPaymentsRoutes",
  prefix: "/payments/owner",
})
  .use(betterAuthPlugin)
  .use(paymentsModule)
  .get(
    "/",
    async ({ user, query, paymentsService, set }) => {
      try {
        const { month, year } = parsePaymentsListQuery(query);
        const search = query.search?.trim() || undefined;
        const status = query.status as PaymentStatusFilter | undefined;
        const data = await paymentsService.getPayments(
          user.id,
          month,
          year,
          search,
          status,
        );
        return apiSuccess("Payments retrieved successfully", data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error al listar pagos";
        set.status = 500;
        return apiError(500, message);
      }
    },
    {
      authenticated: true,
      query: getPaymentsQuerySchema,
      response: {
        200: paymentsListSuccessSchema,
        500: paymentServerErrorSchema,
      },
    },
  )
  .post(
    "/:id/pay",
    async ({ user, params, body, paymentsService, set }) => {
      try {
        const data = await paymentsService.payPayment(
          user.id,
          params.id,
          body.paymentAmount,
          body.method,
        );
        return apiSuccess("Payment updated successfully", data);
      } catch (e) {
        return mapPaymentsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
      body: payPaymentBodySchema,
      response: {
        200: paymentPaySuccessSchema,
        404: paymentNotFoundSchema,
        500: paymentServerErrorSchema,
      },
    },
  )
  .post(
    "/:id/annul",
    async ({ user, params, paymentsService, set }) => {
      try {
        const data = await paymentsService.annulPayment(user.id, params.id);
        return apiSuccess("Payment annulled successfully", data);
      } catch (e) {
        return mapPaymentsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
      response: {
        200: paymentAnnulSuccessSchema,
        404: paymentNotFoundSchema,
        500: paymentServerErrorSchema,
      },
    },
  );
