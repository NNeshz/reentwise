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

// Estructura estándar de Meta para templates
interface TemplateComponent {
  type: "header" | "body" | "button";
  parameters: TemplateParameter[];
  sub_type?: "url" | "quick_reply" | "copy_code";
  index?: number;
}

interface TemplateParameter {
  type: "text" | "image" | "video" | "document" | "location";
  text?: string;
  image?: { link: string };
  video?: { link: string };
  document?: { link: string; filename?: string };
  location?: {
    latitude: string;
    longitude: string;
    name?: string;
    address?: string;
  };
}

interface SendTemplatePayload {
  to: string;               // número destino, ej: "521234567890"
  templateName: string;     // nombre del template, ej: "reentwise_confirmation"
  languageCode?: string;    // default "es_MX"
  components?: TemplateComponent[];
}

/** Solo dígitos; Meta espera el número en formato internacional sin "+". */
export function normalizeKapsoRecipient(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Variables {{1}}, {{2}}, … del cuerpo del template (orden del array). */
export function kapsoBodyParametersFromStrings(
  textParams: string[],
): TemplateComponent[] {
  return [
    {
      type: "body",
      parameters: textParams.map((text) => ({
        type: "text" as const,
        text,
      })),
    },
  ];
}

export async function sendKapsoTemplate(
  payload: SendTemplatePayload
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

  const response = await fetch(
    `${KAPSO_BASE_URL}/${KAPSO_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "X-API-Key": KAPSO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();

  if (!response.ok) {
    const parsed = parseResponseBody(text);
    const detail =
      parsed == null
        ? "(cuerpo vacío)"
        : typeof parsed === "string"
          ? parsed
          : JSON.stringify(parsed);
    throw new Error(`Kapso API error (${response.status}): ${detail}`);
  }
}