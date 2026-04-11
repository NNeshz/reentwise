import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { paymentService } from "@/modules/payment/service/payment-service";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

export function usePayments() {
  const { search, status, month, year } = usePaymentsFilters();

  const trimmedSearch = search?.trim() || undefined;

  return useQuery({
    queryKey: [
      ...queryKeys.payments.all,
      { month, year, search: trimmedSearch, status },
    ],
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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.payments.all,
        refetchType: "all",
      });
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
