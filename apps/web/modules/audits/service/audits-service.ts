import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  AuditsListResponse,
  AuditChannel,
  AuditStatus,
} from "@/modules/audits/types/audits.types";

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

class AuditsService {
  async getAudits(params: {
    page?: number;
    limit?: number;
    tenantId?: string;
    channel?: AuditChannel;
    status?: AuditStatus;
  }): Promise<AuditsListResponse> {
    const query: Record<string, string> = {};
    if (params.page != null) query.page = String(params.page);
    if (params.limit != null) query.limit = String(params.limit);
    if (params.tenantId?.trim()) query.tenantId = params.tenantId.trim();
    if (params.channel) query.channel = params.channel;
    if (params.status) query.status = params.status;

    const response = await apiClient.audits.owner.get({ query });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar las auditorías",
      );
    }

    const data = unwrapEnvelopeData(response.data) as AuditsListResponse;
    if (!data || typeof data !== "object" || !Array.isArray(data.audits)) {
      throw new Error("Respuesta inválida del servidor");
    }
    return data;
  }
}

export const auditsService = new AuditsService();
