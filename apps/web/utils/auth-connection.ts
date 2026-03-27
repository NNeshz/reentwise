import { authClient } from "@reentwise/auth/client/index";

function defaultDashboardCallbackUrl(): string {
  const base = process.env.NEXT_PUBLIC_FRONTEND_URL!.replace(/\/$/, "");
  return `${base}/dashboard`;
}

/** Ruta en el mismo origen (p. ej. `/pricing`) o URL absoluta de retorno tras OAuth. */
export const signInWithGoogle = async (callbackURL?: string) => {
  const response = await authClient.signIn.social({
    provider: "google",
    callbackURL: callbackURL ?? defaultDashboardCallbackUrl(),
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};
