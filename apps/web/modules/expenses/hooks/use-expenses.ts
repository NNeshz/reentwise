import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { expensesService } from "@/modules/expenses/service/expenses-service";
import { useExpensesFilters } from "@/modules/expenses/store/use-expenses-filters";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@/modules/expenses/types/expenses.types";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

export function useExpenses() {
  const { category, propertyId, year, month } = useExpensesFilters();

  const queryParams = {
    category: category || undefined,
    propertyId: propertyId || undefined,
    year: year ?? undefined,
    month: month ?? undefined,
  };

  return useQuery({
    queryKey: [...queryKeys.expenses.all, queryParams],
    queryFn: () => expensesService.getExpenses(queryParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) =>
      expensesService.createExpense(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.all,
        refetchType: "all",
      });
      toast.success("Gasto registrado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al registrar el gasto"),
      );
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { expenseId: string } & UpdateExpenseInput) => {
      const { expenseId, ...data } = input;
      return expensesService.updateExpense(expenseId, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.all,
        refetchType: "all",
      });
      toast.success("Gasto actualizado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al actualizar el gasto"),
      );
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) =>
      expensesService.deleteExpense(expenseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.all,
        refetchType: "all",
      });
      toast.success("Gasto eliminado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al eliminar el gasto"),
      );
    },
  });
}
