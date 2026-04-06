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
} from "@reentwise/api/src/modules/payments/payments.schema";

export const ownerPaymentsRoutes = new Elysia({
  name: "ownerPaymentsRoutes",
  prefix: "/payments/owner",
})
  .use(betterAuthPlugin)
  .use(paymentsModule)
  .get(
    "/",
    async ({ user, query, paymentsService }) => {
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
      return {
        success: true as const,
        status: 200 as const,
        message: "Payments retrieved successfully",
        data,
      };
    },
    {
      authenticated: true,
      query: getPaymentsQuerySchema,
      response: {
        200: paymentsListSuccessSchema,
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
        return {
          success: true as const,
          status: 200 as const,
          message: "Payment updated successfully",
          data,
        };
      } catch (e) {
        if (e instanceof PaymentNotFoundError) {
          set.status = 404;
          return {
            success: false as const,
            status: 404 as const,
            message: e.message,
          };
        }
        throw e;
      }
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
      body: payPaymentBodySchema,
      response: {
        200: paymentPaySuccessSchema,
        404: paymentNotFoundSchema,
      },
    },
  )
  .post(
    "/:id/annul",
    async ({ user, params, paymentsService, set }) => {
      try {
        const data = await paymentsService.annulPayment(user.id, params.id);
        return {
          success: true as const,
          status: 200 as const,
          message: "Payment annulled successfully",
          data,
        };
      } catch (e) {
        if (e instanceof PaymentNotFoundError) {
          set.status = 404;
          return {
            success: false as const,
            status: 404 as const,
            message: e.message,
          };
        }
        throw e;
      }
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
      response: {
        200: paymentAnnulSuccessSchema,
        404: paymentNotFoundSchema,
      },
    },
  );
