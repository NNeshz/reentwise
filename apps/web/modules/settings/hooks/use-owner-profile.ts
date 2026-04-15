import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { settingsService } from "@/modules/settings/service/settings-service";
import type { OwnerProfilePatchInput } from "@/modules/settings/types/settings.types";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

export function useOwnerProfile() {
  return useQuery({
    queryKey: queryKeys.settings.ownerProfile,
    queryFn: () => settingsService.getOwnerProfile(),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: "always",
  });
}

export function useUpdateOwnerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: OwnerProfilePatchInput) =>
      settingsService.patchOwnerProfile(patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.settings.ownerProfile,
        refetchType: "all",
      });
      toast.success("Ajustes guardados correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al guardar los ajustes"),
      );
    },
  });
}
