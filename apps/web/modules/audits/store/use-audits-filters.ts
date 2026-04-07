import { create } from "zustand";
import type { AuditChannel, AuditStatus } from "@/modules/audits/types/audits.types";

/**
 * Filtros de listado: estado en Zustand (no formulario).
 * Los Select aplican cambios al instante; encaja mejor que React Hook Form
 * (sin submit). Para flujos con validación y envío único, usar Form + action.
 */

export const AUDITS_FILTERS_DEFAULT_LIMIT = 25;

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
  limit: AUDITS_FILTERS_DEFAULT_LIMIT,
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
