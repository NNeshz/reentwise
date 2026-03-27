import Elysia from "elysia";
import { stripeService } from "@reentwise/api/src/modules/stripe/stripe.service";

export const stripeModule = new Elysia({
  name: "stripeModule",
}).decorate({
  stripeService,
});
