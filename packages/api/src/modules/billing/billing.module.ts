import { Elysia } from "elysia";
import { billingService } from "@reentwise/api/src/modules/billing/billing.service";

export const billingModule = new Elysia({
  name: "billingModule",
}).decorate("billingService", billingService);
