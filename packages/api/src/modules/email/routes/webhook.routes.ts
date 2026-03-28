import Elysia, { status } from "elysia";
import { env } from "@reentwise/api/src/utils/envs";
import { emailModule } from "@reentwise/api/src/modules/email/email.module";

function svixHeaders(request: Request): {
  id: string;
  timestamp: string;
  signature: string;
} | null {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return null;
  return { id, timestamp, signature };
}

export const emailWebhookRoutes = new Elysia({
  name: "emailWebhookRoutes",
})
  .use(emailModule)
  .post("/webhook", async ({ body, request, emailService }) => {
    const headers = svixHeaders(request);
    if (!headers) {
      return status(400, "Faltan cabeceras svix-id / svix-timestamp / svix-signature");
    }
    if (!env.RESEND_WEBHOOK_SECRET) {
      return status(500, "RESEND_WEBHOOK_SECRET no configurada");
    }

    let event;
    try {
      event = emailService.verifyWebhook(body as string, headers);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return status(400, `Webhook inválido: ${message}`);
    }

    await emailService.handleWebhookEvent(event);
    return { received: true as const };
  });
