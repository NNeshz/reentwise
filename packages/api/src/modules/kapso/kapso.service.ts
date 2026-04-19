/**
 * WhatsApp (Meta/Kapso) outbound templates and HTTP send.
 * Companion Resend HTML for the same logical messages lives in
 * `email/lib/kapso-aligned-html.ts`.
 */
import type { SendTemplatePayload } from "./kapso.meta";

export type { SendTemplatePayload, TemplateComponent, TemplateParameter } from "./kapso.meta";
export {
  kapsoBodyParametersFromStrings,
} from "./kapso.meta";

export {
  KAPSO_DEFAULT_TEMPLATE_NAMES,
  type KapsoLogicalTemplateKey,
  formatKapsoCurrencyMx,
  formatKapsoDayMonthSpanish,
  formatKapsoMonthNameSpanish,
  formatKapsoPropertyLabel,
  formatKapsoPaymentCutoffDay,
  formatKapsoDateShortSpanish,
  type KapsoReminder7dParams,
  kapsoParamsReminder7d,
  kapsoBodyReminder7d,
  type KapsoReminder3dParams,
  kapsoParamsReminder3d,
  kapsoBodyReminder3d,
  type KapsoReminderTodayParams,
  kapsoParamsReminderToday,
  kapsoBodyReminderToday,
  type KapsoReminderConfirmationParams,
  kapsoParamsReminderConfirmation,
  kapsoBodyReminderConfirmation,
  type KapsoAbonoRecivedParams,
  kapsoParamsAbonoRecived,
  kapsoBodyAbonoRecived,
  type KapsoPaymentCompletedParams,
  kapsoParamsPaymentCompleted,
  kapsoBodyPaymentCompleted,
  type KapsoExpirationNoticeParams,
  kapsoParamsExpirationNotice,
  kapsoBodyExpirationNotice,
  kapsoTemplateName,
} from "./kapso.templates";

const KAPSO_BASE_URL = "https://api.kapso.ai/meta/whatsapp/v24.0";
const KAPSO_API_KEY = process.env.KAPSO_API_KEY;
const KAPSO_PHONE_NUMBER_ID = process.env.KAPSO_PHONE_NUMBER_ID!;

function parseResponseBody(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return text;
  }
}

/** Solo dígitos; Meta espera el número en formato internacional sin "+". */
export function normalizeKapsoRecipient(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Número listo para Kapso/Meta, o `null` si no hay dígitos usables.
 * México: 10 dígitos locales → prefijo `521` (52 + 1 móvil).
 */
export function formatWhatsappForKapso(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  let d = raw.replace(/\D/g, "");
  if (!d) return null;

  if (d.length === 10) {
    d = `521${d}`;
  }

  if (d.length < 11) return null;
  return d;
}

const KAPSO_RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const KAPSO_RETRY_DELAYS_MS = [800, 1600];

export async function sendKapsoTemplate(
  payload: SendTemplatePayload,
): Promise<void> {
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: payload.to,
    type: "template",
    template: {
      name: payload.templateName,
      language: {
        code: payload.languageCode ?? "es_MX",
      },
      components: payload.components ?? [],
    },
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= KAPSO_RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, KAPSO_RETRY_DELAYS_MS[attempt - 1]));
    }

    const response = await fetch(
      `${KAPSO_BASE_URL}/${KAPSO_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "X-API-Key": KAPSO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const text = await response.text();
    const parsed = parseResponseBody(text);

    if (response.ok) {
      // Meta puede devolver HTTP 200 con un campo `error` en el body
      // (ej. cuenta restringida, código 368). Lo tratamos como fallo.
      if (
        parsed != null &&
        typeof parsed === "object" &&
        "error" in (parsed as object)
      ) {
        const detail = JSON.stringify((parsed as Record<string, unknown>).error);
        lastError = new Error(`Kapso API error (200/body): ${detail}`);
        break;
      }
      return;
    }

    const detail =
      parsed == null
        ? "(cuerpo vacío)"
        : typeof parsed === "string"
          ? parsed
          : JSON.stringify(parsed);

    lastError = new Error(`Kapso API error (${response.status}): ${detail}`);

    if (!KAPSO_RETRYABLE_STATUSES.has(response.status)) break;
  }

  throw lastError!;
}
