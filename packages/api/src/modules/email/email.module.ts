import { Elysia } from "elysia";
import { emailService } from "@reentwise/api/src/modules/email/email.service";

export const emailModule = new Elysia({
  name: "emailModule",
}).decorate({
  emailService,
});
