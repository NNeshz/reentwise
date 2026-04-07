import { cn } from "@reentwise/ui/src/lib/utils";

export const AUTH_SECTION_LAYOUT =
  "relative flex h-screen min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-4";

export function authFormCardClassName(className?: string): string {
  return cn(
    "mx-auto flex w-full max-w-sm flex-col gap-6 rounded-3xl bg-background p-8 text-left shadow-2xl",
    className,
  );
}
