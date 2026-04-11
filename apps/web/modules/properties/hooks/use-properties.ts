import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { propertiesService } from "@/modules/properties/service/properties-service";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties.all,
    queryFn: () => propertiesService.getOwnerProperties(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertiesService.getPropertyById(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; address?: string }) =>
      propertiesService.createProperty(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.properties.all,
        refetchType: "all",
      });
      toast.success("Propiedad creada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al crear la propiedad"),
      );
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; name: string; address?: string }) =>
      propertiesService.updateProperty(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.properties.all,
        refetchType: "all",
      });
      toast.success("Propiedad actualizada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al actualizar la propiedad"),
      );
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.properties.all,
        refetchType: "all",
      });
      toast.success("Propiedad eliminada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al eliminar la propiedad"),
      );
    },
  });
}
