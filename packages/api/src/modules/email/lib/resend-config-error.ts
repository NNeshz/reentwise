import type { CreateEmailResponse } from "resend";

/** Synthetic Resend error shape when API is misconfigured (no client / no from). */
export function resendConfigErrorResponse(
  message: string,
  name: NonNullable<CreateEmailResponse["error"]>["name"],
): CreateEmailResponse {
  return {
    data: null,
    error: { message, statusCode: null, name },
    headers: null,
  };
}
