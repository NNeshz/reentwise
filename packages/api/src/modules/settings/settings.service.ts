import { db, eq, user } from "@reentwise/database";
import { OwnerProfileNotFoundError } from "@reentwise/api/src/modules/settings/lib/owner-profile-not-found-error";
import { EmptyProfilePatchError } from "@reentwise/api/src/modules/settings/lib/empty-profile-patch-error";

const ownerProfileColumns = {
  currency: user.currency,
  timezone: user.timezone,
  locale: user.locale,
  businessName: user.businessName,
  taxId: user.taxId,
} as const;

export type OwnerProfileSettingsDTO = {
  currency: string | null;
  timezone: string | null;
  locale: string | null;
  businessName: string | null;
  taxId: string | null;
};

export type PatchOwnerProfileInput = {
  currency?: string | null;
  timezone?: string | null;
  locale?: string | null;
  businessName?: string | null;
  taxId?: string | null;
};

export class SettingsService {
  async getOwnerProfile(ownerId: string): Promise<OwnerProfileSettingsDTO> {
    const [row] = await db
      .select(ownerProfileColumns)
      .from(user)
      .where(eq(user.id, ownerId))
      .limit(1);

    if (!row) {
      throw new OwnerProfileNotFoundError();
    }

    return row;
  }

  async patchOwnerProfile(
    ownerId: string,
    patch: PatchOwnerProfileInput,
  ): Promise<OwnerProfileSettingsDTO> {
    const keys = [
      "currency",
      "timezone",
      "locale",
      "businessName",
      "taxId",
    ] as const;
    const hasAny = keys.some((k) => patch[k] !== undefined);
    if (!hasAny) {
      throw new EmptyProfilePatchError();
    }

    const setPayload: Partial<typeof user.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (patch.currency !== undefined) {
      setPayload.currency =
        patch.currency === null ? null : patch.currency.toUpperCase();
    }
    if (patch.timezone !== undefined) {
      const v = patch.timezone === null ? null : patch.timezone.trim();
      setPayload.timezone = v === "" ? null : v;
    }
    if (patch.locale !== undefined) {
      const v = patch.locale === null ? null : patch.locale.trim();
      setPayload.locale = v === "" ? null : v;
    }
    if (patch.businessName !== undefined) {
      const v =
        patch.businessName === null ? null : patch.businessName.trim();
      setPayload.businessName = v === "" ? null : v;
    }
    if (patch.taxId !== undefined) {
      const v = patch.taxId === null ? null : patch.taxId.trim();
      setPayload.taxId = v === "" ? null : v;
    }

    const [updated] = await db
      .update(user)
      .set(setPayload)
      .where(eq(user.id, ownerId))
      .returning(ownerProfileColumns);

    if (!updated) {
      throw new OwnerProfileNotFoundError();
    }

    return updated;
  }
}

export const settingsService = new SettingsService();
