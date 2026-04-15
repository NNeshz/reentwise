/** Sentinel for “use product / account default” in selects (maps to `null` in API). */
export const PROFILE_SELECT_DEFAULT = "__inherit__";

export type ProfileSelectOption = { value: string; label: string };

export const PROFILE_CURRENCY_OPTIONS: ProfileSelectOption[] = [
  { value: "MXN", label: "MXN — Peso mexicano" },
  { value: "USD", label: "USD — Dólar estadounidense" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — Libra esterlina" },
  { value: "CAD", label: "CAD — Dólar canadiense" },
  { value: "BRL", label: "BRL — Real brasileño" },
  { value: "ARS", label: "ARS — Peso argentino" },
  { value: "CLP", label: "CLP — Peso chileno" },
  { value: "COP", label: "COP — Peso colombiano" },
  { value: "PEN", label: "PEN — Sol peruano" },
  { value: "UYU", label: "UYU — Peso uruguayo" },
  { value: "GTQ", label: "GTQ — Quetzal guatemalteco" },
  { value: "CRC", label: "CRC — Colón costarricense" },
  { value: "DOP", label: "DOP — Peso dominicano" },
];

export const PROFILE_LOCALE_OPTIONS: ProfileSelectOption[] = [
  { value: "es-MX", label: "Español (México)" },
  { value: "es", label: "Español" },
  { value: "es-AR", label: "Español (Argentina)" },
  { value: "es-CO", label: "Español (Colombia)" },
  { value: "es-CL", label: "Español (Chile)" },
  { value: "en-US", label: "English (United States)" },
  { value: "en", label: "English" },
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "fr-FR", label: "Français (France)" },
];

/**
 * Zonas horarias acotadas (IANA). Si el usuario tiene otra guardada en BD,
 * `mergeSelectOptions` la añade al desplegable.
 */
export const PROFILE_TIMEZONE_OPTIONS: ProfileSelectOption[] = [
  { value: "America/Mexico_City", label: "México — Ciudad de México" },
  { value: "America/Cancun", label: "México — Cancún" },
  { value: "America/Chihuahua", label: "México — Chihuahua" },
  { value: "America/Mazatlan", label: "México — Mazatlán" },
  { value: "America/Tijuana", label: "México — Tijuana" },
  { value: "America/Guatemala", label: "Guatemala" },
  { value: "America/Tegucigalpa", label: "Honduras" },
  { value: "America/Managua", label: "Nicaragua" },
  { value: "America/Costa_Rica", label: "Costa Rica" },
  { value: "America/Panama", label: "Panamá" },
  { value: "America/Havana", label: "Cuba" },
  { value: "America/Santo_Domingo", label: "Rep. Dominicana" },
  { value: "America/Puerto_Rico", label: "Puerto Rico" },
  { value: "America/Bogota", label: "Colombia — Bogotá" },
  { value: "America/Lima", label: "Perú" },
  { value: "America/Guayaquil", label: "Ecuador" },
  { value: "America/Caracas", label: "Venezuela" },
  { value: "America/La_Paz", label: "Bolivia" },
  { value: "America/Santiago", label: "Chile" },
  { value: "America/Asuncion", label: "Paraguay" },
  { value: "America/Montevideo", label: "Uruguay" },
  { value: "America/Buenos_Aires", label: "Argentina — Buenos Aires" },
  { value: "America/Sao_Paulo", label: "Brasil — São Paulo" },
  { value: "America/New_York", label: "EE. UU. — Este" },
  { value: "America/Chicago", label: "EE. UU. — Centro" },
  { value: "America/Denver", label: "EE. UU. — Montaña" },
  { value: "America/Los_Angeles", label: "EE. UU. — Pacífico" },
  { value: "America/Phoenix", label: "EE. UU. — Arizona" },
  { value: "America/Toronto", label: "Canadá — Toronto" },
  { value: "America/Vancouver", label: "Canadá — Vancouver" },
  { value: "Europe/Madrid", label: "España" },
  { value: "Europe/London", label: "Reino Unido" },
  { value: "Europe/Paris", label: "Francia" },
  { value: "UTC", label: "UTC" },
];

export function mergeSelectOptions(
  base: ProfileSelectOption[],
  currentValue: string | null | undefined,
  formatExtraLabel?: (value: string) => string,
): ProfileSelectOption[] {
  const v = currentValue?.trim();
  if (!v) return base;
  if (base.some((o) => o.value === v)) return base;
  return [
    {
      value: v,
      label: formatExtraLabel ? formatExtraLabel(v) : v,
    },
    ...base,
  ];
}
