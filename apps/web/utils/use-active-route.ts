"use client";

import { usePathname } from "next/navigation";

export function useActiveRoute() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Caso especial para dashboard
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }

    // Caso especial para settings base
    if (href === "/dashboard/settings" && pathname === "/dashboard/settings") {
      return true;
    }

    if (href === pathname) {
      return true;
    }

    if (pathname.startsWith(href) && href !== "/dashboard") {
      const nextChar = pathname[href.length];
      if (nextChar !== "/" && nextChar !== undefined) {
        return false;
      }

      const remainingPath = pathname.slice(href.length);
      return remainingPath === "" || remainingPath === "/";
    }

    return false;
  };

  const getActiveClasses = (href: string) => {
    return isActive(href) ? "bg-primary text-primary-foreground" : "";
  };

  const getTextClasses = (href: string) => {
    return isActive(href) ? "" : "text-muted-foreground";
  };

  return { isActive, getActiveClasses, getTextClasses };
}