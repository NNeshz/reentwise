import Elysia from "elysia";
import { propertiesService } from "@reentwise/api/src/modules/properties/properties.service";

export const propertiesModule = new Elysia({
  name: "propertiesModule",
}).decorate({
  propertiesService: propertiesService,
})