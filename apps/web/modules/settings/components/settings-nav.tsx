"use client";

import { useActiveRoute } from "@reentwise/web/utils/use-active-route";
import { settingsNavItems } from "@/modules/settings/data/settings-nav-items";
import { SETTINGS_NAV_ROW_CLASS } from "@/modules/settings/lib/settings-display";
import { SettingsNavLink } from "./settings-nav-link";

export function SettingsNav() {
  const { getTextClasses } = useActiveRoute();

  return (
    <nav className={SETTINGS_NAV_ROW_CLASS} aria-label="Secciones de configuración">
      {settingsNavItems.map((item) => (
        <SettingsNavLink
          key={item.href}
          href={item.href}
          label={item.label}
          className={getTextClasses(item.href)}
        />
      ))}
    </nav>
  );
}

