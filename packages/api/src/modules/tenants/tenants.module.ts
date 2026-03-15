import Elysia from "elysia";
import { tenantsService } from "./tenants.service";

export const tenantsModule = new Elysia({
  name: "tenantsModule",
}).decorate({
  tenantsService: tenantsService,
});