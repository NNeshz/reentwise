import type { SettingsNavItem } from "@/modules/settings/types/settings.types";

/**
 * Navegación por pestañas vía rutas; el estado activo sale de `useActiveRoute` (no Zustand).
 */
export const settingsNavItems: SettingsNavItem[] = [
  { label: "General", href: "/dashboard/settings" },
  { label: "Cuenta", href: "/dashboard/settings/account" },
];
