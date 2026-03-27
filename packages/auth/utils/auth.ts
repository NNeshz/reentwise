import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "@reentwise/database";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  appName: "reentwise",
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    process.env.NEXT_PUBLIC_BACKEND_URL as string,
  ],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile", "openid"]
    }
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      // IMPORTANTE: Esto se usa en producción para que las cookies se compartan entre los subdominios
      // En desarrollo, se puede omitir este campo
      domain: isProduction ? process.env.NEXT_PUBLIC_REENTWISE : undefined,
    },
  },
  plugins: [
    openAPI()
  ]
})