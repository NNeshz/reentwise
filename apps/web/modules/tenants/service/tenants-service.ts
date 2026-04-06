import { apiClient } from "@/utils/api-connection";

function unwrap(raw: unknown): any {
  return (raw as { data: any }).data;
}

class TenantsService {
  async getTenants(params: {
    search?: string;
    status?: "pending" | "partial" | "paid" | "late" | "annulled";
    propertyId?: string;
    page?: number;
  }) {
    const response = await apiClient.tenants.owner.get({ 
      query: params,
     });

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async getRoomTenants(roomId: string) {
    const response = await apiClient.tenants.owner({ roomId }).get();

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
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
  ) {
    const response = await apiClient.tenants.owner({ roomId }).post(data);

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
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
    },
  ) {
    const response = await apiClient.tenants.owner
      .assign({ roomId })
      .post(data);

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async updateTenant(
    roomId: string,
    tenantId: string,
    data: {
      name?: string;
      whatsapp?: string;
      email?: string;
      paymentDay?: number;
      notes?: string;
    },
  ) {
    const response = await apiClient.tenants
      .owner({ roomId })({ id: tenantId })
      .put(data);

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async deleteTenant(roomId: string, tenantId: string) {
    const response = await apiClient.tenants
      .owner({ roomId })({ id: tenantId })
      .delete({});

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async reassignTenant(
    roomId: string,
    tenantId: string,
    data?: { paymentDay?: number },
  ) {
    const response = await apiClient.tenants.owner
      .reassign({ roomId })({ tenantId })
      .post(data || {});

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async unassignTenant(roomId: string, tenantId: string) {
    const response = await apiClient.tenants.owner
      .unassign({ roomId })({ tenantId })
      .put({});

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async deleteTenantById(tenantId: string) {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      {
        delete: (
          opts?: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
      }
    >;
    const byId = owner["by-id"] as unknown as (params: {
      tenantId: string;
    }) => {
      delete: (
        opts?: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
    };
    const response = await byId({ tenantId }).delete({});

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async getPaymentsByTenant(tenantId: string) {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      {
        get: (
          opts?: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { value: unknown } | null }>;
      }
    >;
    const paymentsEndpoint = owner["payments"] as unknown as (params: {
      tenantId: string;
    }) => {
      get: (
        opts?: Record<string, unknown>,
      ) => Promise<{
        data: {
          payments: Array<{
            id: string;
            tenantId: string;
            amount: string;
            amountPaid: string | null;
            method: string | null;
            status: string | null;
            month: number;
            year: number;
            paidAt: string | null;
            isAnnulled: boolean | null;
            createdAt: string | null;
          }>;
        };
        error: { value: unknown } | null;
      }>;
    };
    const response = await paymentsEndpoint({ tenantId }).get();

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data);
  }

  async getAccountStatus(params: {
    month?: number;
    year?: number;
    search?: string;
    status?: "pending" | "partial" | "paid";
  }) {
    const owner = apiClient.tenants.owner as unknown as Record<
      string,
      {
        get: (opts?: {
          query?: Record<string, unknown>;
        }) => Promise<{ data: unknown; error: { value: unknown } }>;
      }
    >;
    const accountStatus = owner["account-status"];
    if (!accountStatus) {
      throw new Error("Account status endpoint not available");
    }
    const response = await accountStatus.get({ query: params });

    if (response.error) {
      throw response.error.value;
    }

    return unwrap(response.data) as {
      items: Array<{
        tenantId: string;
        tenantName: string;
        tenantWhatsapp: string;
        roomId: string | null;
        roomNumber: string | null;
        paymentId: string | null;
        amount: number | null;
        amountPaid: number;
        status: string;
      }>;
    };
  }
}

export const tenantsService = new TenantsService();
