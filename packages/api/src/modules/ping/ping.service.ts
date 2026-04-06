import { db } from "@reentwise/database";

export type PingResult =
  | { ok: true; now: unknown }
  | { ok: false; error: string };

/** DB connectivity check for health / probes. */
export class PingService {
  async ping(): Promise<PingResult> {
    try {
      const result = await db.execute("SELECT NOW()");
      const row = result[0] as { now?: unknown } | undefined;
      return { ok: true, now: row?.now };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export const pingService = new PingService();
