"use client";

import Link from "next/link";
import { useActiveRoute } from "@reentwise/web/utils/use-active-route";

export function SettingsNav() {
  const { getTextClasses } = useActiveRoute();

  return (
    <div className="flex items-center space-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <Link
        href="/dashboard/settings"
        className={`${getTextClasses("/dashboard/settings")}`}
      >
        General
      </Link>
      <Link
        href="/dashboard/settings/whatsapp"
        className={`${getTextClasses("/dashboard/settings/whatsapp")}`}
      >
        WhatsApp
      </Link>
      <Link
        href="/dashboard/settings/account"
        className={`${getTextClasses("/dashboard/settings/account")}`}
      >
        Cuenta
      </Link>
    </div>
  );
}
