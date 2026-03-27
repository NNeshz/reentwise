import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantsService } from "@/modules/tenants/service/tenants-service";
import { useTenantsFilters } from "@/modules/tenants/store/use-tenants-filte";
import { toast } from "sonner";

const TENANTS_KEY = ["tenants"];

export const useTenantsQuery = () => {
  const { search, status, propertyId, page } = useTenantsFilters();

  const queryParams = {
    search: search?.trim() || undefined,
    status: status || undefined,
    propertyId: propertyId && propertyId !== "all" ? propertyId : undefined,
    page: page ?? 1,
  };

  return useQuery({
    queryKey: [...TENANTS_KEY, queryParams],
    queryFn: () => tenantsService.getTenants(queryParams),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export function useCreateAndAssignTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
      firstMonthRent?: number;
      deposit?: number;
    }) => tenantsService.createAndAssignTenant(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Inquilino asignado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al asignar el inquilino");
      console.error(error);
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) =>
      tenantsService.deleteTenantById(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Inquilino eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar el inquilino");
      console.error(error);
    },
  });
}

export function useTenantPayments(tenantId: string | null) {
  return useQuery({
    queryKey: [...TENANTS_KEY, "payments", tenantId],
    queryFn: () => tenantsService.getPaymentsByTenant(tenantId!),
    enabled: !!tenantId,
  });
}

export function useReassignTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { tenantId: string; paymentDay?: number }) =>
      tenantsService.reassignTenant(roomId, data.tenantId, {
        paymentDay: data.paymentDay,
      }),
    onSuccess: () => {
      // Invalidate everything tenant and room related since rooms changed status
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Inquilino reasignado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al reasignar el inquilino");
      console.error(error);
    },
  });
}

export function useUnassignTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { roomId: string; tenantId: string }) =>
      tenantsService.unassignTenant(data.roomId, data.tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Inquilino desvinculado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al desvincular el inquilino");
      console.error(error);
    },
  });
}
