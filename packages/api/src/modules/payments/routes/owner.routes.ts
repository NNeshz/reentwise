import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { paymentsModule } from "@reentwise/api/src/modules/payments/payments.module";
import {
  getPaymentsQuerySchema,
  payPaymentBodySchema,
  paymentIdParamsSchema,
} from "@reentwise/api/src/modules/payments/payments.schema";

export const ownerPaymentsRoutes = new Elysia({
  name: "ownerPaymentsRoutes",
  prefix: "/payments/owner",
})
  .use(betterAuthPlugin)
  .use(paymentsModule)
  .get(
    "/",
    ({ user, query, paymentsService }) => {
      const now = new Date();
      const month = query?.month ? parseInt(query.month) : now.getMonth() + 1;
      const year = query?.year ? parseInt(query.year) : now.getFullYear();
      const search = query?.search || undefined;
      const status = query?.status || undefined;

      return paymentsService.getPayments(
        user.id,
        month,
        year,
        search,
        status,
      );
    },
    {
      authenticated: true,
      query: getPaymentsQuerySchema,
    },
  )
  .post(
    "/:id/pay",
    ({ user, params, body, paymentsService }) => {
      const { paymentAmount, method } = body;
      return paymentsService.payPayment(
        user.id,
        params.id,
        paymentAmount,
        method,
      );
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
      body: payPaymentBodySchema,
    },
  )
  .post(
    "/:id/annul",
    ({ user, params, paymentsService }) => {
      return paymentsService.annulPayment(user.id, params.id);
    },
    {
      authenticated: true,
      params: paymentIdParamsSchema,
    },
  );
