import { Elysia, t } from "elysia";
import { cronModule } from "@reentwise/api/src/modules/cron/cron.module";

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
        return { success: false, message: "No autorizado" };
      }

      try {
        console.log("☀️ Iniciando rutinas de cobranza diaria de reentwise...");

        const executionLogs = await cronService.runDailyTasks();

        return {
          success: true,
          message: "Rutina diaria completada",
          tasksExecuted: executionLogs.length,
          logs: executionLogs,
        };
      } catch (error) {
        console.error("Error en el Cron Job:", error);
        set.status = 500;
        return {
          success: false,
          message: "Error interno al ejecutar el cron",
          error:
            error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.Optional(t.String()),
      }),
      detail: {
        summary: "Ejecuta las revisiones de pagos (T-5, T=0, T+2)",
        tags: ["Cron Jobs"],
      },
    },
  );
