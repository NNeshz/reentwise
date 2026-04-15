import Elysia from "elysia";
import { expensesService } from "@reentwise/api/src/modules/expenses/expenses.service";

export const expensesModule = new Elysia({
  name: "expensesModule",
}).decorate({
  expensesService,
});
