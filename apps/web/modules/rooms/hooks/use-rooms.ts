import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsService } from "@/modules/rooms/service/rooms-service";
import type { RoomStatus } from "@/modules/rooms/constants";
import { toast } from "sonner";

const ROOMS_KEY = ["rooms"];

export const useRooms = (propertyId: string) => {
  return useQuery({
    queryKey: [...ROOMS_KEY, propertyId],
    queryFn: () => roomsService.getRoomsByPropertyId(propertyId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

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
      isOccupied?: boolean;
      notes?: string;
    }) => roomsService.createRoom(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOMS_KEY, propertyId] });
      toast.success("Habitación creada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al crear la habitación");
      console.error(error);
    },
  });
}

export function useDeleteRoom(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => roomsService.deleteRoom(propertyId, roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOMS_KEY, propertyId] });
      toast.success("Habitación eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar la habitación");
      console.error(error);
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
      isOccupied?: boolean;
      notes?: string;
    }) => roomsService.updateRoom(propertyId, data.roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOMS_KEY, propertyId] });
      toast.success("Habitación actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar la habitación");
      console.error(error);
    },
  });
}

export function useUpdateRoomStatus(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { roomId: string; status: RoomStatus }) =>
      roomsService.updateRoomStatus(propertyId, data.roomId, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOMS_KEY, propertyId] });
      toast.success("Estado de la habitación actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el estado de la habitación");
      console.error(error);
    },
  });
}
