"use client";

import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import type { LandingNavLink } from "@/modules/landing/types/landing.types";
import { LandingNavbarSessionCta } from "./landing-navbar-session-cta";

type Props = {
  open: boolean;
  onClose: () => void;
  links: LandingNavLink[];
  hasSession: boolean;
};

export function LandingNavbarMobile({
  open,
  onClose,
  links,
  hasSession,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex flex-col bg-background px-6 pt-24 md:hidden"
        >
          <div className="flex flex-col gap-6 text-xl">
            {links.map((link, i) => (
              <m.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              </m.div>
            ))}
          </div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <LandingNavbarSessionCta
              isScrolled
              hasSession={hasSession}
              className="h-12 w-full text-lg"
              onNavigate={onClose}
              mobileLabel={hasSession ? "Dashboard" : "Comenzar gratis"}
            />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
