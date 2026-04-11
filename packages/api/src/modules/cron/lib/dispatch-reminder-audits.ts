import { auditsService } from "@reentwise/api/src/modules/audits/audits.service";
import { emailService } from "@reentwise/api/src/modules/email/email.service";

export type CronReminderTenant = {
  id: string;
  name: string;
  email: string | null;
};

/**
 * One WhatsApp audit + optional email audit (shared shape for T-7/T-3/today/late).
 * `noteBase` is stored without channel suffix; audits append `|wa` / `|email`.
 * Idempotencia por canal y solo con `status = sent`, para poder reintentar WA si el correo ya salió.
 */
export async function dispatchCronReminderAudits(input: {
  tenant: CronReminderTenant;
  noteBase: string;
  /** Dígitos internacionales para Kapso; null = omitir WhatsApp (sin audit). */
  kapsoTo: string | null;
  sendKapso: (to: string) => Promise<void>;
  email?: {
    build: () => { subject: string; html: string; text: string };
    typeTag: string;
  };
  logKind: string;
}): Promise<void> {
  const { tenant, noteBase, kapsoTo, sendKapso, email, logKind } = input;

  const waAlreadySent = await auditsService.hasCronReminderChannelSent(
    tenant.id,
    noteBase,
    "whatsapp",
  );

  if (kapsoTo && !waAlreadySent) {
    await auditsService.withWhatsAppAudit(
      {
        tenantId: tenant.id,
        tenantName: tenant.name,
        note: `${noteBase}|wa`,
      },
      () => sendKapso(kapsoTo),
      (err) => console.error(`[Cron][WA][${logKind}] ${tenant.name}:`, err),
    );
  } else if (!kapsoTo && !waAlreadySent) {
    console.warn(
      `[Cron][WA][${logKind}] ${tenant.name}: sin número WhatsApp válido (se omite Kapso)`,
    );
  }

  const emailTo = tenant.email?.trim() || null;
  if (!emailTo || !email) return;

  const emailAlreadySent = await auditsService.hasCronReminderChannelSent(
    tenant.id,
    noteBase,
    "email",
  );
  if (emailAlreadySent) return;

  const { subject, html, text } = email.build();
  await auditsService.withEmailAudit(
    {
      tenantId: tenant.id,
      tenantName: tenant.name,
      note: `${noteBase}|email`,
    },
    () =>
      emailService.sendHtml({
        to: emailTo,
        subject,
        html,
        text,
        tags: [
          { name: "type", value: email.typeTag },
          { name: "module", value: "cron" },
        ],
        idempotencyKey: `${noteBase}|email`,
      }),
    (err) => console.error(`[Cron][Email][${logKind}] ${tenant.name}:`, err),
  );
}
