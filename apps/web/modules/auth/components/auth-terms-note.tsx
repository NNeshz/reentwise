import { FieldDescription } from "@reentwise/ui/src/components/field";

export function AuthTermsNote() {
  return (
    <FieldDescription className="pt-4 text-center text-xs leading-relaxed text-balance">
      Al continuar, aceptas nuestros{" "}
      <span className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline">
        Términos de servicio
      </span>{" "}
      y crearás una cuenta automáticamente si aún no tienes una.
    </FieldDescription>
  );
}
