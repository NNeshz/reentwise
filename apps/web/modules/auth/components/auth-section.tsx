import { AuthForm } from "./auth-form";
import { AuthBackground } from "./auth-background";
import { AUTH_SECTION_LAYOUT } from "@/modules/auth/lib/auth-display";
import type { AuthSectionProps } from "@/modules/auth/types/auth.types";

export function AuthSection({ callbackNext }: AuthSectionProps) {
  return (
    <section className={AUTH_SECTION_LAYOUT}>
      <AuthBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <AuthForm callbackNext={callbackNext} />
      </div>
    </section>
  );
}
