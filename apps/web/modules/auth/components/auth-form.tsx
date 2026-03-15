"use client";

import { cn } from "@reentwise/ui/src/lib/utils";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@reentwise/ui/src/components/field";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { signInWithGoogle } from "@/utils/auth-connection";

export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-6 bg-background p-8 rounded-3xl shadow-2xl w-full max-w-sm mx-auto text-left",
        className,
      )}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-host-grotesk">
            Bienvenido a reentwise
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Ingresa o crea tu cuenta usando Google
          </p>
        </div>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full h-12 rounded-full font-medium"
            onClick={signInWithGoogle}
          >
            <IconBrandGoogleFilled className="w-5 h-5 mr-2 text-foreground" />
            Iniciar sesión con Google
          </Button>
          <FieldDescription className="text-center text-xs pt-4 text-balance leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <a
              href="#"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Términos de servicio
            </a>{" "}
            y crearás una cuenta automáticamente si aún no tienes una.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
