"use client";

import Link from "next/link";
import { cn } from "@reentwise/ui/src/lib/utils";

type Props = {
  href: string;
  label: string;
  className: string;
};

export function SettingsNavLink({ href, label, className }: Props) {
  return (
    <Link href={href} className={cn(className)}>
      {label}
    </Link>
  );
}
