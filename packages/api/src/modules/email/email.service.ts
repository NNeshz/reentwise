import { Resend, type CreateEmailResponse } from "resend";
import { env } from "@reentwise/api/src/utils/envs";

export type SendHtmlEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  idempotencyKey?: string;
  tags?: { name: string; value: string }[];
  scheduledAt?: string;
  headers?: Record<string, string>;
  /** Overrides `RESEND_FROM`; must use a verified domain in production (not `onboarding@resend.dev`). */
  from?: string;
};

function configError(
  message: string,
  name: NonNullable<CreateEmailResponse["error"]>["name"],
): CreateEmailResponse {
  return {
    data: null,
    error: { message, statusCode: null, name },
    headers: null,
  };
}

/**
 * Resend-backed email sending. Uses `RESEND_API_KEY` and optional default `RESEND_FROM`.
 * Prefer `idempotencyKey` (e.g. `welcome-user/<userId>`) for safe retries.
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

  async sendHtml(input: SendHtmlEmailInput): Promise<CreateEmailResponse> {
    const from = input.from ?? env.RESEND_FROM;
    if (!this.client) {
      return configError(
        "RESEND_API_KEY is not configured",
        "missing_api_key",
      );
    }
    if (!from) {
      return configError(
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
