/** Payload for `EmailService.sendHtml` (Resend `emails.send`). */
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
  /** Overrides `RESEND_FROM`; verified domain required in prod (not `onboarding@resend.dev`). */
  from?: string;
};
