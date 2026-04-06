import { defineConfig } from "drizzle-kit";

function getDatabaseUrl(): string {
  const directUrl = process.env.DIRECT_URL;
  if (directUrl) return directUrl;

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL or DIRECT_URL is required (p. ej. fly secrets set DATABASE_URL=... antes de fly deploy).",
    );
  }

  // If using pgbouncer (port 6543), convert to direct connection (port 5432)
  if (dbUrl.includes(":6543")) {
    return dbUrl
      .replace(":6543", ":5432")
      .replace(/[?&]pgbouncer=true/, "")
      .replace(/[?&]pgbouncer=false/, "");
  }

  return dbUrl;
}

export default defineConfig({
  schema: ["./src/plan-enums.ts", "./src/schema.ts", "./src/other.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
