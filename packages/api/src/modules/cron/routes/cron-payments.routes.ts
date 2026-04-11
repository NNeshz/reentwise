import { Elysia, t } from "elysia";
import { cronModule } from "@reentwise/api/src/modules/cron/cron.module";
import {
  cronDailySuccessResponseSchema,
  cronDailyUnauthorizedSchema,
  cronDailyErrorSchema,
} from "@reentwise/api/src/modules/cron/cron.schema";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

export const cronPaymentsRoutes = new Elysia({
  name: "cronPaymentsRoutes",
  prefix: "/cron/payments",
})
  .use(cronModule)
  .post(
    "/daily",
    async ({ headers, set, cronService }) => {
      const authHeader = headers.authorization;
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        set.status = 401;
        return apiError(401, "No autorizado");
      }

      try {
        console.log("☀️ Iniciando rutinas de cobranza diaria de reentwise...");

        const executionLogs = await cronService.runDailyTasks();

        return apiSuccess("Rutina diaria completada", {
          tasksExecuted: executionLogs.length,
          logs: executionLogs,
        });
      } catch (error) {
        console.error("Error en el Cron Job:", error);
        set.status = 500;
        const detail =
          error instanceof Error ? error.message : "Error desconocido";
        return apiError(500, `Error interno al ejecutar el cron: ${detail}`);
      }
    },
    {
      headers: t.Object({
        authorization: t.Optional(t.String()),
      }),
      response: {
        200: cronDailySuccessResponseSchema,
        401: cronDailyUnauthorizedSchema,
        500: cronDailyErrorSchema,
      },
      detail: {
        summary:
          "Rutina diaria de cobranza y recordatorios (T-7, T-3, día de pago, +2 mora)",
        description:
          "Autenticación: header `Authorization: Bearer <CRON_SECRET>`. Incluye backfill de cobros: genera pagos pendientes/mora para periodos cuyo día de cobro ya pasó si el cron falló o no corrió.",
        tags: [openApiTags.Cron],
      },
    },
  );
