import Elysia from "elysia";
import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";

export const auditsModule = new Elysia({
  name: "auditsModule",
}).decorate({
  auditsService,
});
