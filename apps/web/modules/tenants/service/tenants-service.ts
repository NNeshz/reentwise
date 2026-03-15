import { apiClient } from "@/utils/api-connection";

export class TenantsService {
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

    return response.data;
  }

  async getRoomTenants(roomId: string) {
    const response = await apiClient.tenants.owner({ roomId }).get();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async createTenant(
    roomId: string,
    data: {
      name: string;
      whatsapp: string;
      paymentDay: number;
      notes?: string;
    },
  ) {
    const response = await apiClient.tenants.owner({ roomId }).post(data);

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async createAndAssignTenant(
    roomId: string,
    data: {
      name: string;
      whatsapp: string;
      paymentDay: number;
      notes?: string;
    },
  ) {
    const response = await apiClient.tenants.owner
      .assign({ roomId })
      .post(data);

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateTenant(
    roomId: string,
    tenantId: string,
    data: {
      name?: string;
      whatsapp?: string;
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

    return response.data;
  }

  async deleteTenant(roomId: string, tenantId: string) {
    const response = await apiClient.tenants
      .owner({ roomId })({ id: tenantId })
      .delete({});

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
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

    return response.data;
  }

  async unassignTenant(roomId: string, tenantId: string) {
    const response = await apiClient.tenants.owner
      .unassign({ roomId })({ tenantId })
      .put({});

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
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

    return response.data as {
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
