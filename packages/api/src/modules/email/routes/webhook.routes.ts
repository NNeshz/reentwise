import Elysia from "elysia";
import { env } from "@reentwise/api/src/utils/envs";
import { emailModule } from "@reentwise/api/src/modules/email/email.module";
import { parseSvixHeaders } from "@reentwise/api/src/modules/email/utils/svix-headers";
import {
  emailWebhookSuccessSchema,
  emailWebhookBadRequestSchema,
  emailWebhookServerErrorSchema,
} from "@reentwise/api/src/modules/email/email.schema";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";

export const emailWebhookRoutes = new Elysia({
  name: "emailWebhookRoutes",
})
  .use(emailModule)
  .post(
    "/webhook",
    async ({ body, request, emailService, set }) => {
      const headers = parseSvixHeaders(request);
      if (!headers) {
        set.status = 400;
        return apiError(
          400,
          "Faltan cabeceras Svix (svix-id, svix-timestamp, svix-signature)",
        );
      }
      if (!env.RESEND_WEBHOOK_SECRET) {
        set.status = 500;
        return apiError(500, "RESEND_WEBHOOK_SECRET no configurada");
      }

      let event;
      try {
        event = emailService.verifyWebhook(body as string, headers);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        set.status = 400;
        return apiError(400, `Webhook inválido: ${message}`);
      }

      try {
        await emailService.handleWebhookEvent(event);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Error al procesar el webhook";
        set.status = 500;
        return apiError(500, message);
      }

      return apiSuccess("Webhook procesado", { received: true as const });
    },
    {
      response: {
        200: emailWebhookSuccessSchema,
        400: emailWebhookBadRequestSchema,
        500: emailWebhookServerErrorSchema,
      },
    },
  );
