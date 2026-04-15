import { env } from "@reentwise/api/src/utils/envs";

/**
 * Tag names for `detail.tags` on routes. Declared in OpenAPI `documentation.tags`
 * for descriptions in Scalar/Swagger.
 */
export const openApiTags = {
  Health: "Health",
  Properties: "Properties",
  Rooms: "Rooms",
  Tenants: "Tenants",
  Payments: "Payments",
  Contracts: "Contracts",
  Expenses: "Expenses",
  Metrics: "Metrics",
  Audits: "Audits",
  Cron: "Cron",
  Billing: "Billing",
  Webhooks: "Webhooks",
  Settings: "Settings",
} as const;

const envelopeDoc = [
  "## Contrato de respuesta",
  "Todas las rutas JSON propias usan el mismo sobre:",
  "",
  "- **Éxito (2xx):** `{ success: true, status: 200, message: string, data: … }`",
  "- **Error:** `{ success: false, status: number, message: string }`",
  "",
  "Rutas **Owner** requieren sesión Better Auth (cookie). Sin sesión: **401** con el mismo cuerpo de error.",
  "",
  "Los webhooks externos validan firma (Polar Standard Webhooks, Resend/Svix); el cuerpo de éxito sigue el mismo `data` cuando aplica.",
].join("\n");

const backendUrl = env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

/** Passed to `@elysiajs/openapi` `documentation` option. */
export const openApiDocumentation = {
  info: {
    title: "Reentwise API",
    version: "1.0.50",
    description: envelopeDoc,
  },
  ...(backendUrl
    ? {
        servers: [{ url: backendUrl, description: "Backend (env)" }],
      }
    : {}),
  tags: [
    {
      name: openApiTags.Health,
      description: "Comprobación de servicio y base de datos.",
    },
    {
      name: openApiTags.Properties,
      description: "Propiedades del propietario autenticado.",
    },
    {
      name: openApiTags.Rooms,
      description: "Cuartos por propiedad.",
    },
    {
      name: openApiTags.Tenants,
      description: "Inquilinos, asignación a cuartos y pagos por inquilino.",
    },
    {
      name: openApiTags.Payments,
      description: "Listado y operaciones sobre pagos mensuales (owner).",
    },
    {
      name: openApiTags.Contracts,
      description:
        "Contratos / arrendamientos: ciclo de vida, PDF y renovaciones.",
    },
    {
      name: openApiTags.Expenses,
      description:
        "Gastos del propietario (mantenimiento, impuestos, seguros, etc.).",
    },
    {
      name: openApiTags.Metrics,
      description: "Métricas y tarjetas del dashboard.",
    },
    {
      name: openApiTags.Audits,
      description: "Historial de envíos y auditoría de mensajería.",
    },
    {
      name: openApiTags.Cron,
      description: "Tareas programadas (autenticación por secreto).",
    },
    {
      name: openApiTags.Billing,
      description: "Checkout y suscripciones vía Polar.",
    },
    {
      name: openApiTags.Webhooks,
      description: "Endpoints para proveedores externos (firma obligatoria).",
    },
    {
      name: openApiTags.Settings,
      description:
        "Preferencias de cuenta del propietario (moneda, zona horaria, datos fiscales).",
    },
  ],
};
