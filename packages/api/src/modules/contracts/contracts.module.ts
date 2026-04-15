import Elysia from "elysia";
import { contractsService } from "@reentwise/api/src/modules/contracts/contracts.service";

export const contractsModule = new Elysia({
  name: "contractsModule",
}).decorate({
  contractsService,
});
