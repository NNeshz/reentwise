import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type {
  PaymentListRow,
  PaymentMethod,
  PaymentMutationRow,
  PaymentStatusFilter,
} from "@/modules/payment/types/payment.types";
import {
  parsePaymentMutationRow,
  parsePaymentsList,
} from "@/modules/payment/lib/validate-payment-payload";

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

class PaymentService {
  async getPayments(params: {
    month: number;
    year: number;
    search?: string;
    status?: PaymentStatusFilter;
  }): Promise<PaymentListRow[]> {
    const query: Record<string, string> = {
      month: String(params.month),
      year: String(params.year),
    };

    if (params.search?.trim()) query.search = params.search.trim();
    if (params.status) query.status = params.status;

    const response = await apiClient.payments.owner.get({ query });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar los pagos",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePaymentsList(unwrapped);
  }

  async payPayment(
    paymentId: string,
    data: {
      paymentAmount: number;
      method: PaymentMethod;
    },
  ): Promise<PaymentMutationRow> {
    const response = await apiClient.payments
      .owner({ id: paymentId })
      .pay.post(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo registrar el pago",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parsePaymentMutationRow(unwrapped);
  }
}

export const paymentService = new PaymentService();

export type {
  PaymentListRow,
  PaymentMethod,
  PaymentMonthRow,
  PaymentMutationRow,
  PaymentRoomSummary,
  PaymentStatusFilter,
  PaymentTenantRow,
} from "@/modules/payment/types/payment.types";
