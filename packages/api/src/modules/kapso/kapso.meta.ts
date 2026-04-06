// Estructura estándar de Meta para templates (Kapso / WhatsApp Cloud API)

export interface TemplateComponent {
  type: "header" | "body" | "button";
  parameters: TemplateParameter[];
  sub_type?: "url" | "quick_reply" | "copy_code";
  index?: number;
}

export interface TemplateParameter {
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

export interface SendTemplatePayload {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: TemplateComponent[];
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
