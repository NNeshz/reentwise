import { Resend } from "resend";

/**
 * SDK instance without API key — only `webhooks.verify` is used (Svix).
 * Sending uses `EmailService`’s keyed client.
 */
export const resendWebhookVerifier = new Resend();
