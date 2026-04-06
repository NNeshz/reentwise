import {
  Resend,
  type CreateEmailResponse,
  type EmailReceivedEvent,
  type WebhookEventPayload,
} from "resend";
import { env } from "@reentwise/api/src/utils/envs";
import type { SendHtmlEmailInput } from "@reentwise/api/src/modules/email/lib/send-html-email.types";
import { resendConfigErrorResponse } from "@reentwise/api/src/modules/email/lib/resend-config-error";
import { resendWebhookVerifier } from "@reentwise/api/src/modules/email/lib/resend-webhook-verifier";

export type { SendHtmlEmailInput } from "@reentwise/api/src/modules/email/lib/send-html-email.types";

/**
 * Resend-backed outbound email (`RESEND_API_KEY`, default `RESEND_FROM`).
 * Use `idempotencyKey` for safe retries (e.g. `welcome-user/<userId>`).
 *
 * @see https://resend.com/docs
 */
export class EmailService {
  private readonly client: Resend | null;

  constructor() {
    this.client = env.RESEND_API_KEY
      ? new Resend(env.RESEND_API_KEY)
      : null;
  }

  /** Svix verify; throws if secret missing or signature invalid. */
  verifyWebhook(
    rawBody: string,
    svix: { id: string; timestamp: string; signature: string },
  ): WebhookEventPayload {
    const secret = env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("RESEND_WEBHOOK_SECRET no está configurada");
    }
    return resendWebhookVerifier.webhooks.verify({
      payload: rawBody,
      headers: svix,
      webhookSecret: secret,
    });
  }

  /**
   * Inbound hook entrypoint; extend `onEmailReceived` for content via Resend received API.
   * @see https://resend.com/docs/dashboard/receiving/get-email-content
   */
  async handleWebhookEvent(event: WebhookEventPayload): Promise<void> {
    if (event.type === "email.received") {
      await this.onEmailReceived(event);
    }
  }

  private async onEmailReceived(event: EmailReceivedEvent): Promise<void> {
    if (env.NODE_ENV === "development") {
      console.info("[email.received]", {
        email_id: event.data.email_id,
        to: event.data.to,
        subject: event.data.subject,
        attachmentCount: event.data.attachments.length,
      });
    }
  }

  async sendHtml(input: SendHtmlEmailInput): Promise<CreateEmailResponse> {
    const from = input.from ?? env.RESEND_FROM;
    if (!this.client) {
      return resendConfigErrorResponse(
        "RESEND_API_KEY is not configured",
        "missing_api_key",
      );
    }
    if (!from) {
      return resendConfigErrorResponse(
        "RESEND_FROM is not set and no from was provided",
        "missing_required_field",
      );
    }

    return await this.client.emails.send(
      {
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { replyTo: input.replyTo } : {}),
        ...(input.cc ? { cc: input.cc } : {}),
        ...(input.bcc ? { bcc: input.bcc } : {}),
        ...(input.tags ? { tags: input.tags } : {}),
        ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
        ...(input.headers ? { headers: input.headers } : {}),
      },
      input.idempotencyKey
        ? { idempotencyKey: input.idempotencyKey }
        : undefined,
    );
  }
}

export const emailService = new EmailService();
