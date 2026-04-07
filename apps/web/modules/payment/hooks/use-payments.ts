import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/modules/payment/service/payment-service";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

const PAYMENTS_KEY = ["payments"] as const;

export function usePayments() {
  const { search, status, month, year } = usePaymentsFilters();

  const trimmedSearch = search?.trim() || undefined;

  return useQuery({
    queryKey: [...PAYMENTS_KEY, { month, year, search: trimmedSearch, status }],
    queryFn: () =>
      paymentService.getPayments({
        month,
        year,
        search: trimmedSearch,
        status,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePayPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      paymentId: string;
      paymentAmount: number;
      method: "cash" | "transfer" | "deposit";
    }) =>
      paymentService.payPayment(data.paymentId, {
        paymentAmount: data.paymentAmount,
        method: data.method,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
      toast.success(
        "Pago registrado correctamente. Recibo enviado por WhatsApp.",
      );
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al registrar el pago"),
      );
    },
  });
}
