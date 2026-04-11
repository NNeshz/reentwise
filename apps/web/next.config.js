/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: backendUrl,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
  },
  /**
   * El checkout llama a `/api/billing/*` en el mismo origen (cookies de sesión).
   * Elysia vive en `NEXT_PUBLIC_BACKEND_URL`; sin esto Next responde 404.
   * `afterFiles` deja intactas rutas propias como `app/api/trigger-cron`.
   */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/billing/:path*",
          destination: `${backendUrl.replace(/\/$/, "")}/api/billing/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;