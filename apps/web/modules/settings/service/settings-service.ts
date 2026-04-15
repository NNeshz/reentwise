import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  OwnerProfilePatchInput,
  OwnerProfileSettings,
} from "@/modules/settings/types/settings.types";
import { parseOwnerProfile } from "@/modules/settings/lib/validate-owner-profile-payload";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

class SettingsService {
  async getOwnerProfile(): Promise<OwnerProfileSettings> {
    const response = await apiClient.settings.owner.profile.get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los ajustes de perfil",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseOwnerProfile(unwrapped);
  }

  async patchOwnerProfile(
    patch: OwnerProfilePatchInput,
  ): Promise<OwnerProfileSettings> {
    const response = await apiClient.settings.owner.profile.patch(patch);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron guardar los ajustes de perfil",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseOwnerProfile(unwrapped);
  }
}

export const settingsService = new SettingsService();
