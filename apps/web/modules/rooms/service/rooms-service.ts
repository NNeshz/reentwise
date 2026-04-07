import { apiClient } from "@/utils/api-connection";
import { errorMessageFromUnknown } from "@/utils/normalize-error";
import type { RoomDetail, RoomListItem, RoomMutationRow } from "@/modules/rooms/types/rooms.types";
import type { RoomStatus } from "@/modules/rooms/types/rooms.types";
import {
  parseRoomDetail,
  parseRoomMutationRow,
  parseRoomsList,
} from "@/modules/rooms/lib/validate-room-payload";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

class RoomsService {
  async getRoomsByPropertyId(propertyId: string): Promise<RoomListItem[]> {
    const response = await apiClient.rooms.owner({ propertyId }).get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudieron cargar las habitaciones",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomsList(unwrapped);
  }

  async getRoomById(propertyId: string, roomId: string): Promise<RoomDetail> {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .get();

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo cargar la habitación",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomDetail(unwrapped);
  }

  async createRoom(
    propertyId: string,
    data: {
      roomNumber: string;
      price: string;
      notes?: string;
    },
  ): Promise<RoomMutationRow> {
    const response = await apiClient.rooms.owner({ propertyId }).post(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo crear la habitación",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomMutationRow(unwrapped);
  }

  async updateRoom(
    propertyId: string,
    roomId: string,
    data: {
      roomNumber?: string;
      price?: string;
      notes?: string;
    },
  ): Promise<RoomMutationRow> {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .put(data);

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo actualizar la habitación",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomMutationRow(unwrapped);
  }

  async deleteRoom(
    propertyId: string,
    roomId: string,
  ): Promise<RoomMutationRow> {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .delete({});

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo eliminar la habitación",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomMutationRow(unwrapped);
  }

  async updateRoomStatus(
    propertyId: string,
    roomId: string,
    status: RoomStatus,
  ): Promise<RoomMutationRow> {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .status.put({ status });

    if (response.error) {
      throw toServiceError(
        response.error.value,
        "No se pudo actualizar el estado de la habitación",
      );
    }

    const unwrapped = unwrapEnvelopeData(response.data);
    return parseRoomMutationRow(unwrapped);
  }
}

export const roomsService = new RoomsService();

export type {
  RoomDetail,
  RoomListItem,
  RoomMutationRow,
  RoomStatus,
  RoomTenantSummary,
  RoomListSortOption,
} from "@/modules/rooms/types/rooms.types";

export { ROOM_STATUS_VALUES } from "@/modules/rooms/types/rooms.types";
