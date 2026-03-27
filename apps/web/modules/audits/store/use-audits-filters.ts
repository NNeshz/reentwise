import { create } from "zustand";
import type { AuditChannel, AuditStatus } from "@/modules/audits/service/audits-service";

const DEFAULT_LIMIT = 25;

interface AuditsFiltersStore {
  page: number;
  limit: number;
  tenantId?: string;
  channel?: AuditChannel;
  status?: AuditStatus;
}

interface AuditsFiltersActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTenantId: (tenantId?: string) => void;
  setChannel: (channel?: AuditChannel) => void;
  setStatus: (status?: AuditStatus) => void;
  resetFilters: () => void;
}

const initial: AuditsFiltersStore = {
  page: 1,
  limit: DEFAULT_LIMIT,
  tenantId: undefined,
  channel: undefined,
  status: undefined,
};

export const useAuditsFilters = create<
  AuditsFiltersStore & AuditsFiltersActions
>((set) => ({
  ...initial,
  setPage: (page) => set({ page: Math.max(1, page) }),
  setLimit: (limit) =>
    set({ limit: Math.min(Math.max(1, limit), 100), page: 1 }),
  setTenantId: (tenantId?: string) => set({ tenantId, page: 1 }),
  setChannel: (channel) => set({ channel, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  resetFilters: () => set({ ...initial }),
}));
