import { z } from "zod";
import type { OwnerProfileSettings } from "@/modules/settings/types/settings.types";

const ownerProfileDataSchema = z.object({
  currency: z.string().nullable(),
  timezone: z.string().nullable(),
  locale: z.string().nullable(),
  businessName: z.string().nullable(),
  taxId: z.string().nullable(),
});

export function parseOwnerProfile(data: unknown): OwnerProfileSettings {
  return ownerProfileDataSchema.parse(data);
}
