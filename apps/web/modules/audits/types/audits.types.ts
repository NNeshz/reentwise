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
  audits: AuditRow[];
  failedCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
};

export type AuditsListPagination = AuditsListResponse["pagination"];
