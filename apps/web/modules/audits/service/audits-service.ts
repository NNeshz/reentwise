import { apiClient } from "@/utils/api-connection";

export type AuditChannel = "email" | "whatsapp";
export type AuditStatus = "pending" | "sending" | "sent" | "failed";

export type AuditRow = {
  id: string;
  tenantId: string;
  tenantName: string;
  channel: AuditChannel;
  status: AuditStatus;
  /** ISO string o `Date` según el cliente Eden. */
  loggedAt: string | Date;
  note: string;
};

export type AuditsListResponse = {
  message: string;
  status: number;
  audits: AuditRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

class AuditsService {
  async getAudits(params: {
    page?: number;
    limit?: number;
    tenantId?: string;
    channel?: AuditChannel;
    status?: AuditStatus;
  }) {
    const query: Record<string, string> = {};
    if (params.page != null) query.page = String(params.page);
    if (params.limit != null) query.limit = String(params.limit);
    if (params.tenantId?.trim()) query.tenantId = params.tenantId.trim();
    if (params.channel) query.channel = params.channel;
    if (params.status) query.status = params.status;

    const response = await apiClient.audits.owner.get({ query });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const auditsService = new AuditsService();
