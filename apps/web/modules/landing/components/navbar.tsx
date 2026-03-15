"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@reentwise/ui/src/lib/utils";
import { Button } from "@reentwise/ui/src/components/button";
import { useTheme } from "next-themes";
import { authClient } from "@reentwise/auth/client";

const navLinks = [
  { name: "Cómo funciona", href: "#" },
  { name: "Funcionalidades", href: "#" },
  { name: "Testimonios", href: "#" },
  { name: "Precios", href: "#" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use a slightly narrower max-width when scrolled for the desktop pill effect
  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-4 px-4 transition-all duration-300",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.nav
          className={cn(
            "flex items-center justify-between px-3 py-3 w-full rounded-full transition-all duration-300",
            isScrolled
              ? "bg-background/90 backdrop-blur-md shadow-sm border border-border/50 max-w-4xl"
              : "bg-transparent max-w-7xl",
          )}
          layout
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <Image
              src="/logo.png"
              alt="reentwise Logo"
              width={24}
              height={24}
              className={cn(
                "object-contain transition-all",
                resolvedTheme === "dark"
                  ? isScrolled || mobileMenuOpen
                    ? "invert"
                    : "invert"
                  : isScrolled || mobileMenuOpen
                    ? ""
                    : "invert",
              )}
            />
            <span
              className={cn(
                "font-bold text-lg transition-colors",
                isScrolled || mobileMenuOpen
                  ? "text-foreground"
                  : "text-white hidden md:block",
                !isScrolled && "md:text-white",
              )}
            >
              reentwise
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isScrolled
                    ? "text-muted-foreground"
                    : "text-white/80 hover:text-white",
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button
              variant={isScrolled ? "default" : "secondary"}
              className={cn(
                "rounded-full px-6 font-semibold",
                !isScrolled &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              asChild
            >
              <Link href={session ? "/dashboard" : "/auth"}>
                {session ? "Dashboard" : "Comenzar"}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <IconX className="text-foreground" />
            ) : (
              <IconMenu2
                className={isScrolled ? "text-foreground" : "text-white"}
              />
            )}
          </button>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-foreground font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Button className="w-full rounded-full h-12 text-lg font-semibold" asChild>
                <Link href={session ? "/dashboard" : "/auth"} onClick={() => setMobileMenuOpen(false)}>
                  {session ? "Dashboard" : "Comenzar gratis"}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
