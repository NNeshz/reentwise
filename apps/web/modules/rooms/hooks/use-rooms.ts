import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsService } from "@/modules/rooms/service/rooms-service";
import type { RoomStatus } from "@/modules/rooms/types/rooms.types";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { toast } from "sonner";

const ROOMS_KEY = ["rooms"] as const;

function invalidateRoomQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  propertyId: string,
  roomId?: string,
) {
  void queryClient.invalidateQueries({ queryKey: [...ROOMS_KEY, propertyId] });
  if (roomId) {
    void queryClient.invalidateQueries({
      queryKey: [...ROOMS_KEY, propertyId, roomId],
    });
  }
}

export function useRooms(propertyId: string) {
  return useQuery({
    queryKey: [...ROOMS_KEY, propertyId],
    queryFn: () => roomsService.getRoomsByPropertyId(propertyId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!propertyId,
  });
}

export function useRoom(propertyId: string, roomId: string) {
  return useQuery({
    queryKey: [...ROOMS_KEY, propertyId, roomId],
    queryFn: () => roomsService.getRoomById(propertyId, roomId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!propertyId && !!roomId,
  });
}

export function useCreateRoom(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      roomNumber: string;
      price: string;
      notes?: string;
    }) => roomsService.createRoom(propertyId, data),
    onSuccess: () => {
      invalidateRoomQueries(queryClient, propertyId);
      toast.success("Habitación creada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al crear la habitación"),
      );
    },
  });
}

export function useDeleteRoom(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => roomsService.deleteRoom(propertyId, roomId),
    onSuccess: (_data, roomId) => {
      invalidateRoomQueries(queryClient, propertyId, roomId);
      toast.success("Habitación eliminada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al eliminar la habitación"),
      );
    },
  });
}

export function useUpdateRoom(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      roomId: string;
      roomNumber?: string;
      price?: string;
      notes?: string;
    }) =>
      roomsService.updateRoom(propertyId, data.roomId, {
        roomNumber: data.roomNumber,
        price: data.price,
        notes: data.notes,
      }),
    onSuccess: (_data, variables) => {
      invalidateRoomQueries(queryClient, propertyId, variables.roomId);
      toast.success("Habitación actualizada correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(error, "Error al actualizar la habitación"),
      );
    },
  });
}

export function useUpdateRoomStatus(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { roomId: string; status: RoomStatus }) =>
      roomsService.updateRoomStatus(propertyId, data.roomId, data.status),
    onSuccess: (_data, variables) => {
      invalidateRoomQueries(queryClient, propertyId, variables.roomId);
      toast.success("Estado de la habitación actualizado correctamente");
    },
    onError: (error: unknown) => {
      toast.error(
        errorMessageFromUnknown(
          error,
          "Error al actualizar el estado de la habitación",
        ),
      );
    },
  });
}
