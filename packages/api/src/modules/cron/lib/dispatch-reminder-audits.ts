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
 */
export async function dispatchCronReminderAudits(input: {
  tenant: CronReminderTenant;
  noteBase: string;
  sendKapso: () => Promise<void>;
  email?: {
    build: () => { subject: string; html: string; text: string };
    typeTag: string;
  };
  logKind: string;
}): Promise<void> {
  const { tenant, noteBase, sendKapso, email, logKind } = input;

  await auditsService.withWhatsAppAudit(
    {
      tenantId: tenant.id,
      tenantName: tenant.name,
      note: `${noteBase}|wa`,
    },
    sendKapso,
    (err) => console.error(`[Cron][WA][${logKind}] ${tenant.name}:`, err),
  );

  const emailTo = tenant.email;
  if (!emailTo || !email) return;

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
