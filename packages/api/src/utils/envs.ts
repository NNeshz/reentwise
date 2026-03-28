import { Type as t } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  NODE_ENV: t.Union([t.Literal("development"), t.Literal("production")], {
    default: "development",
  }),
  AUTH_SECRET: t.String(),
  DATABASE_URL: t.String(),
  NEXT_PUBLIC_BACKEND_URL: t.String(),
  NEXT_PUBLIC_FRONTEND_URL: t.String(),
  NEXT_PUBLIC_FRONTEND_WWW: t.Optional(t.String()),
  NEXT_PUBLIC_REENTWISE: t.Optional(t.String()),
  GOOGLE_CLIENT_ID: t.String(),
  GOOGLE_CLIENT_SECRET: t.String(),
  WHATSAPP_API_URL: t.Optional(t.String()),
  WHATSAPP_API_KEY: t.Optional(t.String()),
  RESEND_API_KEY: t.Optional(t.String()),
  RESEND_FROM: t.Optional(t.String()),
  /** Signing secret del webhook en Resend (Svix); requerido para `POST /api/email/webhook`. */
  RESEND_WEBHOOK_SECRET: t.Optional(t.String()),
  STRIPE_SECRET_KEY: t.Optional(t.String()),
  STRIPE_WEBHOOK_SECRET: t.Optional(t.String()),
  STRIPE_PRICE_BASICO: t.Optional(t.String()),
  STRIPE_PRICE_PRO: t.Optional(t.String()),
  STRIPE_PRICE_PATRON: t.Optional(t.String()),
});

type EnvSchema = typeof envSchema.static;

const processEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development",
};
// Valida las variables de entorno
const validateEnv = () => {
  if (!Value.Check(envSchema, processEnv)) {
    const errors = Value.Errors(envSchema, processEnv);
    for (const error of errors) {
      console.error(
        `❌ Variable inválida: ${error.path}, Detalles: ${error.message}`,
      );
    }
    throw new Error("Configuración de entorno inválida.");
  }
};

// Ejecuta la validación
validateEnv();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      AUTH_SECRET: string;
      DATABASE_URL: string;
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_FRONTEND_URL: string;
      NEXT_PUBLIC_FRONTEND_WWW?: string;
      NEXT_PUBLIC_REENTWISE?: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      WHATSAPP_API_URL?: string;
      WHATSAPP_API_KEY?: string;
      RESEND_API_KEY?: string;
      RESEND_FROM?: string;
      RESEND_WEBHOOK_SECRET?: string;
      STRIPE_SECRET_KEY?: string;
      STRIPE_WEBHOOK_SECRET?: string;
      STRIPE_PRICE_BASICO?: string;
      STRIPE_PRICE_PRO?: string;
      STRIPE_PRICE_PATRON?: string;
    }
  }
}

export const env = Value.Cast(envSchema, processEnv);
