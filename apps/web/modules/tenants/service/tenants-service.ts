import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  AccountStatusResponse,
  RoomTenantsResponse,
  TenantCore,
  TenantPaymentsResponse,
  TenantPaymentFilterStatus,
  TenantsListResponse,
} from "@/modules/tenants/types/tenants.types";
import {
  parseAccountStatusResponse,
  parseRoomTenantsResponse,
  parseTenantCore,
  parseTenantPaymentsResponse,
  parseTenantsListResponse,
} from "@/modules/tenants/lib/validate-tenant-payload";

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

class TenantsService {
  async getTenants(params: {
    search?: string;
    status?: TenantPaymentFilterStatus;
    propertyId?: string;
    page?: number;
  }): Promise<TenantsListResponse> {
    const query: Record<string, string | number> = {};
    if (params.search?.trim()) query.search = params.search.trim();
    if (params.status) query.status = params.status;
    if (params.propertyId?.trim()) query.propertyId = params.propertyId.trim();
    if (params.page != null) query.page = params.page;

    const response = await apiClient.tenants.owner.get({
      query: query as {
        search?: string;
        status?: TenantPaymentFilterStatus;
        propertyId?: string;
        page?: number;
      },
    });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los inquilinos",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantsListResponse(unwrapped);
  }

  async getRoomTenants(roomId: string): Promise<RoomTenantsResponse> {
    const response = await apiClient.tenants.owner({ roomId }).get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los inquilinos del cuarto",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomTenantsResponse(unwrapped);
  }

  async createTenant(
    roomId: string,
    data: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
    },
  ): Promise<TenantCore> {
    const response = await apiClient.tenants.owner({ roomId }).post(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo crear el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async createAndAssignTenant(
    roomId: string,
    data: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
      firstMonthRent?: number;
      deposit?: number;
      contractStartsAt?: string;
      contractEndsAt?: string;
    },
  ): Promise<TenantCore> {
    const response = await apiClient.tenants.owner.assign({ roomId }).post(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo asignar el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async updateTenant(
    tenantId: string,
    data: {
      name?: string;
      whatsapp?: string;
      email?: string;
      paymentDay?: number;
      notes?: string;
    },
  ): Promise<TenantCore> {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      (params: { tenantId: string }) => {
        put: (body: Record<string, unknown>) => Promise<{
          data: unknown;
          error: { value: unknown } | null;
        }>;
      }
    >;
    const byId = owner["by-id"];
    if (!byId) {
      throw new Error("Ruta de actualización por ID no disponible en el cliente");
    }
    const response = await byId({ tenantId }).put(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo actualizar el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async deleteTenant(roomId: string, tenantId: string): Promise<TenantCore> {
    const response = await apiClient.tenants
      .owner({ roomId })({ id: tenantId })
      .delete({});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo eliminar el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async reassignTenant(
    roomId: string,
    tenantId: string,
    data?: { paymentDay?: number },
  ): Promise<TenantCore> {
    const response = await apiClient.tenants.owner
      .reassign({ roomId })({ tenantId })
      .post(data ?? {});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo reasignar el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async unassignTenant(
    roomId: string,
    tenantId: string,
  ): Promise<TenantCore> {
    const response = await apiClient.tenants.owner
      .unassign({ roomId })({ tenantId })
      .put({});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo desvincular el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async deleteTenantById(tenantId: string): Promise<TenantCore> {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      (params: { tenantId: string }) => {
        delete: (opts?: Record<string, unknown>) => Promise<{
          data: unknown;
          error: { value: unknown } | null;
        }>;
      }
    >;
    const byId = owner["by-id"];
    if (!byId) {
      throw new Error("Ruta de eliminación por ID no disponible en el cliente");
    }
    const response = await byId({ tenantId }).delete({});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo eliminar el inquilino",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantCore(unwrapped);
  }

  async getPaymentsByTenant(tenantId: string): Promise<TenantPaymentsResponse> {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      (params: { tenantId: string }) => {
        get: (opts?: Record<string, unknown>) => Promise<{
          data: unknown;
          error: { value: unknown } | null;
        }>;
      }
    >;
    const payments = owner["payments"];
    if (!payments) {
      throw new Error("Ruta de pagos no disponible en el cliente");
    }
    const response = await payments({ tenantId }).get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los pagos",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseTenantPaymentsResponse(unwrapped);
  }

  async getAccountStatus(params: {
    month?: number;
    year?: number;
    search?: string;
    status?: "pending" | "partial" | "paid";
  }): Promise<AccountStatusResponse> {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      {
        get: (opts?: {
          query?: Record<string, unknown>;
        }) => Promise<{ data: unknown; error: { value: unknown } | null }>;
      }
    >;
    const accountStatus = owner["account-status"];
    if (!accountStatus?.get) {
      throw new Error("Endpoint de estado de cuenta no disponible");
    }
    const response = await accountStatus.get({ query: params });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo cargar el estado de cuenta",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseAccountStatusResponse(unwrapped);
  }
}

export const tenantsService = new TenantsService();

export type {
  AccountStatusItem,
  AccountStatusResponse,
  RoomTenantsResponse,
  TenantCore,
  TenantListRow,
  TenantPaymentFilterStatus,
  TenantPaymentRecord,
  TenantPaymentsResponse,
  TenantRoomSummary,
  TenantsListPagination,
  TenantsListResponse,
} from "@/modules/tenants/types/tenants.types";
