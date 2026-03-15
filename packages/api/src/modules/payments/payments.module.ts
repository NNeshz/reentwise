import Elysia from "elysia";
import { paymentsService } from "@reentwise/api/src/modules/payments/payments.service";

export const paymentsModule = new Elysia({
  name: "paymentsModule",
}).decorate({
  paymentsService,
});
