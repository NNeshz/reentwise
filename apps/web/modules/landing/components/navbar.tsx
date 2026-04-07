"use client";

import { useState, useSyncExternalStore } from "react";
import { m } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@reentwise/ui/src/lib/utils";
import { useTheme } from "next-themes";
import { authClient } from "@reentwise/auth/client";
import { landingNavLinks } from "@/modules/landing/data";
import { useLandingNavbarScroll } from "@/modules/landing/hooks/use-landing-navbar-scroll";
import { LandingNavbarLogo } from "./landing-navbar-logo";
import { LandingNavbarDesktopLinks } from "./landing-navbar-desktop-links";
import { LandingNavbarSessionCta } from "./landing-navbar-session-cta";
import { LandingNavbarMobile } from "./landing-navbar-mobile";

const subscribeNoop = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = useLandingNavbarScroll();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientMounted,
    getServerMounted,
  );
  const { data: session } = authClient.useSession();

  const logoInvert = Boolean(
    mounted && resolvedTheme === "dark",
  );

  return (
    <>
      <m.header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex items-center justify-center px-4 pt-4 transition-all duration-300",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <m.nav
          className={cn(
            "flex w-full items-center justify-between rounded-full px-3 py-3 transition-all duration-300",
            isScrolled
              ? "max-w-4xl border border-border/50 bg-background/90 shadow-sm backdrop-blur-md"
              : "max-w-7xl bg-transparent",
          )}
          layout
        >
          <LandingNavbarLogo
            isScrolled={isScrolled}
            mobileMenuOpen={mobileMenuOpen}
            logoInvert={logoInvert}
          />

          <LandingNavbarDesktopLinks links={landingNavLinks} isScrolled={isScrolled} />

          <div className="hidden md:block">
            <LandingNavbarSessionCta
              isScrolled={isScrolled}
              hasSession={Boolean(session)}
            />
          </div>

          <button
            type="button"
            className="z-50 p-2 md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? (
              <IconX className="text-foreground" />
            ) : (
              <IconMenu2
                className={isScrolled ? "text-foreground" : "text-white"}
              />
            )}
          </button>
        </m.nav>
      </m.header>

      <LandingNavbarMobile
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={landingNavLinks}
        hasSession={Boolean(session)}
      />
    </>
  );
}
