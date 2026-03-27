# API (Elysia + Bun) — monorepo: apps/backend_worker + packages/api, database, auth
# Base alineado con packageManager del repo
FROM oven/bun:1.2 AS runner

RUN apt-get update -y && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Capa de dependencias (cache de build)
COPY package.json bun.lock turbo.json ./
COPY apps/backend_worker/package.json ./apps/backend_worker/
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/database/package.json ./packages/database/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Excluye web y UI del árbol de instalación (Next/React no hacen falta en la API)
RUN bun install --frozen-lockfile --filter '!@reentwise/web' --filter '!@reentwise/ui'

# Código fuente necesario para el backend (no apps/web)
COPY packages/typescript-config ./packages/typescript-config
COPY packages/database ./packages/database
COPY packages/auth ./packages/auth
COPY packages/api ./packages/api
COPY apps/backend_worker ./apps/backend_worker

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Raíz del monorepo para resolver workspaces y node_modules
WORKDIR /app

CMD ["bun", "run", "apps/backend_worker/src/index.ts"]
