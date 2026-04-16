import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { expensesModule } from "@reentwise/api/src/modules/expenses/expenses.module";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import { ExpenseNotFoundError } from "@reentwise/api/src/modules/expenses/lib/expense-not-found-error";
import {
  expenseIdParamsSchema,
  expensesListQuerySchema,
  createExpenseBodySchema,
  updateExpenseBodySchema,
  expensesSuccessSchema,
  expensesError404Schema,
  expensesError500Schema,
} from "@reentwise/api/src/modules/expenses/expenses.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapExpenseRouteError(
  e: unknown,
  set: { status?: number | string },
) {
  if (e instanceof ExpenseNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  const message =
    e instanceof Error ? e.message : "Error desconocido";
  set.status = 500;
  return apiError(500, message);
}

export const ownerExpenseRoutes = new Elysia({
  name: "ownerExpenseRoutes",
  prefix: "/expenses/owner",
})
  .use(betterAuthPlugin)
  .use(expensesModule)
  .get(
    "/",
    async ({ user, query, expensesService, set }) => {
      try {
        const data = await expensesService.getExpensesByOwner(user.id, {
          from: query.from,
          to: query.to,
          year: query.year,
          month: query.month,
          propertyId: query.propertyId,
          category: query.category,
        });
        return apiSuccess("Gastos obtenidos", data);
      } catch (e) {
        return mapExpenseRouteError(e, set);
      }
    },
    {
      authenticated: true,
      query: expensesListQuerySchema,
      detail: {
        tags: [openApiTags.Expenses],
        summary: "Listar gastos del dueño",
        description:
          "Filtros opcionales: `from`/`to` (ISO date YYYY-MM-DD), `year`, `month` (1-12), `propertyId`, `category`.",
      },
      response: { 200: expensesSuccessSchema, 500: expensesError500Schema },
    },
  )
  .get(
    "/:expenseId",
    async ({ user, params, expensesService, set }) => {
      try {
        const data = await expensesService.getExpenseById(
          params.expenseId,
          user.id,
        );
        if (!data) throw new ExpenseNotFoundError();
        return apiSuccess("Gasto obtenido", data);
      } catch (e) {
        return mapExpenseRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: expenseIdParamsSchema,
      detail: {
        tags: [openApiTags.Expenses],
        summary: "Obtener gasto por ID",
      },
      response: {
        200: expensesSuccessSchema,
        404: expensesError404Schema,
        500: expensesError500Schema,
      },
    },
  )
  .post(
    "/",
    async ({ user, body, expensesService, set }) => {
      try {
        const data = await expensesService.createExpense(user.id, {
          ...body,
          incurredAt: body.incurredAt ? new Date(body.incurredAt) : undefined,
        });
        set.status = 201;
        return apiSuccess("Gasto creado", data);
      } catch (e) {
        return mapExpenseRouteError(e, set);
      }
    },
    {
      authenticated: true,
      body: createExpenseBodySchema,
      detail: {
        tags: [openApiTags.Expenses],
        summary: "Registrar nuevo gasto",
      },
      response: { 200: expensesSuccessSchema, 500: expensesError500Schema },
    },
  )
  .patch(
    "/:expenseId",
    async ({ user, params, body, expensesService, set }) => {
      try {
        const patch: Record<string, unknown> = { ...body };
        if (body.incurredAt) patch.incurredAt = new Date(body.incurredAt);
        const data = await expensesService.updateExpense(
          params.expenseId,
          user.id,
          patch as Parameters<typeof expensesService.updateExpense>[2],
        );
        if (!data) throw new ExpenseNotFoundError();
        return apiSuccess("Gasto actualizado", data);
      } catch (e) {
        return mapExpenseRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: expenseIdParamsSchema,
      body: updateExpenseBodySchema,
      detail: {
        tags: [openApiTags.Expenses],
        summary: "Actualizar gasto",
      },
      response: {
        200: expensesSuccessSchema,
        404: expensesError404Schema,
        500: expensesError500Schema,
      },
    },
  )
  .delete(
    "/:expenseId",
    async ({ user, params, expensesService, set }) => {
      try {
        const data = await expensesService.deleteExpense(
          params.expenseId,
          user.id,
        );
        if (!data) throw new ExpenseNotFoundError();
        return apiSuccess("Gasto eliminado", data);
      } catch (e) {
        return mapExpenseRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: expenseIdParamsSchema,
      detail: {
        tags: [openApiTags.Expenses],
        summary: "Eliminar gasto",
      },
      response: {
        200: expensesSuccessSchema,
        404: expensesError404Schema,
        500: expensesError500Schema,
      },
    },
  );
