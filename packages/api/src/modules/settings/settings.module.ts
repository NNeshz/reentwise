import Elysia from "elysia";
import { settingsService } from "@reentwise/api/src/modules/settings/settings.service";

export const settingsModule = new Elysia({
  name: "settingsModule",
}).decorate({
  settingsService,
});
