import { authClient } from "@reentwise/auth/client/index";

export const signInWithGoogle = async () => {
  const response = await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
  });


  console.log(response);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data
};
