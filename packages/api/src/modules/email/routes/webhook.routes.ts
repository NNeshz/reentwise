import Elysia from "elysia";
import { env } from "@reentwise/api/src/utils/envs";
import { emailModule } from "@reentwise/api/src/modules/email/email.module";
import { parseSvixHeaders } from "@reentwise/api/src/modules/email/utils/svix-headers";
import {
  emailWebhookSuccessSchema,
  emailWebhookBadRequestSchema,
  emailWebhookServerErrorSchema,
} from "@reentwise/api/src/modules/email/email.schema";

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
        return {
          success: false as const,
          status: 400 as const,
          message:
            "Faltan cabeceras Svix (svix-id, svix-timestamp, svix-signature)",
        };
      }
      if (!env.RESEND_WEBHOOK_SECRET) {
        set.status = 500;
        return {
          success: false as const,
          status: 500 as const,
          message: "RESEND_WEBHOOK_SECRET no configurada",
        };
      }

      let event;
      try {
        event = emailService.verifyWebhook(body as string, headers);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        set.status = 400;
        return {
          success: false as const,
          status: 400 as const,
          message: `Webhook inválido: ${message}`,
        };
      }

      await emailService.handleWebhookEvent(event);
      return {
        success: true as const,
        status: 200 as const,
        message: "Webhook procesado",
        received: true as const,
      };
    },
    {
      response: {
        200: emailWebhookSuccessSchema,
        400: emailWebhookBadRequestSchema,
        500: emailWebhookServerErrorSchema,
      },
    },
  );
