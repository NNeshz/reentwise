import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesService } from "@/modules/properties/service/properties-service";
import { toast } from "sonner";

const PROPERTIES_KEY = ["properties"];

export function useProperties() {
  return useQuery({
    queryKey: PROPERTIES_KEY,
    queryFn: () => propertiesService.getOwnerProperties(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: [...PROPERTIES_KEY, id],
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
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
      toast.success("Propiedad creada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al crear la propiedad");
      console.error(error);
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; name: string; address?: string }) =>
      propertiesService.updateProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
      toast.success("Propiedad actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar la propiedad");
      console.error(error);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROPERTIES_KEY });
      toast.success("Propiedad eliminada correctamente");
    },
  });
}
