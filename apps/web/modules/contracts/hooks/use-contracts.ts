import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { contractsService } from "@/modules/contracts/service/contracts-service";
import { useContractsFilters } from "@/modules/contracts/store/use-contracts-filters";
import type { UpdateContractInput } from "@/modules/contracts/types/contracts.types";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

export function useContractsQuery() {
  const { search, page } = useContractsFilters();

  return useQuery({
    queryKey: [...queryKeys.contracts.all, { search, page }],
    queryFn: () => contractsService.getContracts({ search, page }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { contractId: string } & UpdateContractInput) => {
      const { contractId, ...data } = input;
      return contractsService.updateContract(contractId, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contracts.all,
        refetchType: "all",
      });
      toast.success("Contrato actualizado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(errorMessageFromUnknown(error, "Error al actualizar el contrato"));
    },
  });
}

export function useActivateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.activateContract(contractId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contracts.all,
        refetchType: "all",
      });
      toast.success("Contrato activado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(errorMessageFromUnknown(error, "Error al activar el contrato"));
    },
  });
}

export function useTerminateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) =>
      contractsService.terminateContract(contractId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contracts.all,
        refetchType: "all",
      });
      toast.success("Contrato terminado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(errorMessageFromUnknown(error, "Error al terminar el contrato"));
    },
  });
}
