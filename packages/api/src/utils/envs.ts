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
  // Kapso variables
  KAPSO_API_KEY: t.String(),
  KAPSO_PHONE_NUMBER_ID: t.String(),
  // Kapso template variables (nombres en Meta; por defecto los canónicos reentwise_*)
  KAPSO_WELCOME_TEMPLATE_NAME: t.String(),
  KAPSO_TEMPLATE_REMINDER_7D: t.String(),
  KAPSO_TEMPLATE_REMINDER_3D: t.String(),
  KAPSO_TEMPLATE_REMINDER_TODAY: t.String(),
  KAPSO_TEMPLATE_ABONO_RECIVED: t.String(),
  KAPSO_TEMPLATE_PAYMENT_COMPLETED: t.String(),
  KAPSO_TEMPLATE_EXPIRATION_NOTICE: t.String(),
  // Resend email variables
  RESEND_API_KEY: t.Optional(t.String()),
  RESEND_FROM: t.Optional(t.String()),
  RESEND_WEBHOOK_SECRET: t.Optional(t.String()),
  // Polar (billing)
  POLAR_ACCESS_TOKEN: t.Optional(t.String()),
  POLAR_WEBHOOK_SECRET: t.Optional(t.String()),
  POLAR_SERVER: t.Optional(
    t.Union([t.Literal("production"), t.Literal("sandbox")]),
  ),
  POLAR_PRODUCT_BASICO: t.Optional(t.String()),
  POLAR_PRODUCT_PRO: t.Optional(t.String()),
  POLAR_PRODUCT_PATRON: t.Optional(t.String()),
  /** IANA TZ para fechas del cron (recordatorios / backfill). Ej: America/Mexico_City */
  CRON_TIMEZONE: t.Optional(t.String()),
});

type EnvSchema = typeof envSchema.static;

const processEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development",
  KAPSO_WELCOME_TEMPLATE_NAME:
    process.env.KAPSO_WELCOME_TEMPLATE_NAME ?? "reentwise_confirmation",
  /** Alias legacy: `KAPSO_REMINDER_*` si aún está en .env */
  KAPSO_TEMPLATE_REMINDER_7D:
    process.env.KAPSO_TEMPLATE_REMINDER_7D ??
    process.env.KAPSO_REMINDER_7D ??
    /** Nombre en Meta/Kapso (typo sin segunda "e") */
    "reentwis_reminder_7d",
  KAPSO_TEMPLATE_REMINDER_3D:
    process.env.KAPSO_TEMPLATE_REMINDER_3D ??
    process.env.KAPSO_REMINDER_3D ??
    "reentwise_reminder_3d",
  KAPSO_TEMPLATE_REMINDER_TODAY:
    process.env.KAPSO_TEMPLATE_REMINDER_TODAY ??
    process.env.KAPSO_REMINDER_TODAY ??
    "reentwise_reminder_today",
  KAPSO_TEMPLATE_ABONO_RECIVED:
    process.env.KAPSO_TEMPLATE_ABONO_RECIVED ??
    process.env.KAPSO_ABONO_RECIVED ??
    "reentwise_abono_recived",
  KAPSO_TEMPLATE_PAYMENT_COMPLETED:
    process.env.KAPSO_TEMPLATE_PAYMENT_COMPLETED ??
    process.env.KAPSO_PAYMENT_COMPLETED ??
    "reentwise_payment_completed",
  KAPSO_TEMPLATE_EXPIRATION_NOTICE:
    process.env.KAPSO_TEMPLATE_EXPIRATION_NOTICE ??
    process.env.KAPSO_EXPIRATION_NOTICE ??
    "reentwise_expiration_notice",
  CRON_TIMEZONE: process.env.CRON_TIMEZONE,
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
      KAPSO_API_KEY: string;
      KAPSO_PHONE_NUMBER_ID: string;
      KAPSO_WELCOME_TEMPLATE_NAME: string;
      KAPSO_TEMPLATE_REMINDER_7D: string;
      KAPSO_TEMPLATE_REMINDER_3D: string;
      KAPSO_TEMPLATE_REMINDER_TODAY: string;
      KAPSO_TEMPLATE_ABONO_RECIVED: string;
      KAPSO_TEMPLATE_PAYMENT_COMPLETED: string;
      KAPSO_TEMPLATE_EXPIRATION_NOTICE: string;
      RESEND_API_KEY?: string;
      RESEND_FROM?: string;
      RESEND_WEBHOOK_SECRET?: string;
      POLAR_ACCESS_TOKEN?: string;
      POLAR_WEBHOOK_SECRET?: string;
      POLAR_SERVER?: "production" | "sandbox";
      POLAR_PRODUCT_BASICO?: string;
      POLAR_PRODUCT_PRO?: string;
      POLAR_PRODUCT_PATRON?: string;
      CRON_TIMEZONE?: string;
    }
  }
}

export const env = Value.Cast(envSchema, processEnv);
