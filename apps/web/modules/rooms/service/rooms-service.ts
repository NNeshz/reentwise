import { apiClient } from "@/utils/api-connection";
import type { RoomStatus } from "@/modules/rooms/constants";

export class RoomsService {
  constructor() {}

  async getRoomsByPropertyId(propertyId: string) {
    const response = await apiClient.rooms.owner({ propertyId }).get();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async getRoomById(propertyId: string, roomId: string) {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .get();

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async createRoom(
    propertyId: string,
    data: {
      roomNumber: string;
      price: string;
      isOccupied?: boolean;
      notes?: string;
    },
  ) {
    const response = await apiClient.rooms.owner({ propertyId }).post(data);

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateRoom(
    propertyId: string,
    roomId: string,
    data: {
      roomNumber?: string;
      price?: string;
      isOccupied?: boolean;
      notes?: string;
    },
  ) {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .put(data);

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async deleteRoom(propertyId: string, roomId: string) {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .delete({});

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }

  async updateRoomStatus(
    propertyId: string,
    roomId: string,
    status: RoomStatus,
  ) {
    const response = await apiClient.rooms
      .owner({ propertyId })({ id: roomId })
      .status.put({ status });

    if (response.error) {
      throw response.error.value;
    }

    return response.data;
  }
}

export const roomsService = new RoomsService();
