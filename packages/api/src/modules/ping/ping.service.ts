import { db } from "@reentwise/database";

export class PingService {
  async ping() {
    try {
      const result = await db.execute("SELECT NOW()");

      return {
        message: "reentwise is running",
        result: result[0]?.now,
      };
    } catch (error) {
      return {
        message: "reentwise is not running",
        error: (error as Error).message,
      };
    }
  }
}

export const pingService = new PingService();
