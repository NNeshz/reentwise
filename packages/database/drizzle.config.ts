import { defineConfig } from "drizzle-kit";
import { resolveDirectDatabaseUrl } from "./src/lib/direct-database-url";

export default defineConfig({
  schema: [
    "./src/enums/plan-tier.ts",
    "./src/enums/app.ts",
    "./src/schema/auth.ts",
    "./src/schema/domain.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: resolveDirectDatabaseUrl(),
  },
});
