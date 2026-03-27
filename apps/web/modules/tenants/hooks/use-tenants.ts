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

export const useTenants = (roomId: string) => {
  return useQuery({
    queryKey: [...TENANTS_KEY, roomId],
    queryFn: () => tenantsService.getRoomTenants(roomId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!roomId,
  });
};

export function useCreateTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      whatsapp: string;
      email: string;
      paymentDay: number;
      notes?: string;
    }) => tenantsService.createTenant(roomId, data),
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

export function useUpdateTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      tenantId: string;
      name?: string;
      whatsapp?: string;
      email?: string;
      paymentDay?: number;
      notes?: string;
    }) => tenantsService.updateTenant(roomId, data.tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TENANTS_KEY, roomId] });
      toast.success("Inquilino actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el inquilino");
      console.error(error);
    },
  });
}

export function useDeleteTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) =>
      tenantsService.deleteTenant(roomId, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TENANTS_KEY, roomId] });
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

export function useUnassignTenant(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string) =>
      tenantsService.unassignTenant(roomId, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...TENANTS_KEY, roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Inquilino desasignado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al desasignar el inquilino");
      console.error(error);
    },
  });
}
