import { apiClient } from "@/utils/api-connection";

class PaymentService {
  async getPayments(params: {
    month: number;
    year: number;
    search?: string;
    status?: "pending" | "partial" | "paid";
  }) {
    const query: Record<string, string> = {
      month: String(params.month),
      year: String(params.year),
    };

    if (params.search) query.search = params.search;
    if (params.status) query.status = params.status;

    const response = await apiClient.payments.owner.get({ query });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async payPayment(
    paymentId: string,
    data: {
      paymentAmount: number;
      method: "cash" | "transfer" | "deposit";
    },
  ) {
    const response = await apiClient.payments
      .owner({ id: paymentId })
      .pay.post(data);

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const paymentService = new PaymentService();
