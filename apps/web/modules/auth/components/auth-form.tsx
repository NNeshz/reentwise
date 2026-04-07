"use client";

import type { ComponentProps } from "react";
import { Field, FieldGroup } from "@reentwise/ui/src/components/field";
import { buildGoogleOAuthCallbackUrl } from "@/modules/auth/service/auth-service";
import { authFormCardClassName } from "@/modules/auth/lib/auth-display";
import { useGoogleSignIn } from "@/modules/auth/hooks/use-google-sign-in";
import { AuthFormHeader } from "./auth-form-header";
import { AuthGoogleButton } from "./auth-google-button";
import { AuthTermsNote } from "./auth-terms-note";
import { AuthSignInError } from "./auth-sign-in-error";

type Props = ComponentProps<"form"> & {
  callbackNext?: string;
};

export function AuthForm({ className, callbackNext, ...props }: Props) {
  const { mutate, isPending, isError, error, reset } = useGoogleSignIn();

  const callbackUrl = buildGoogleOAuthCallbackUrl(callbackNext);

  function handleSignIn() {
    reset();
    mutate(callbackUrl);
  }

  return (
    <form
      className={authFormCardClassName(className)}
      {...props}
    >
      <FieldGroup>
        <AuthFormHeader />

        {isError && (
          <AuthSignInError
            error={error}
            onRetry={handleSignIn}
            isRetrying={isPending}
          />
        )}

        <Field>
          <AuthGoogleButton disabled={isPending} onClick={handleSignIn} />
          <AuthTermsNote />
        </Field>
      </FieldGroup>
    </form>
  );
}
