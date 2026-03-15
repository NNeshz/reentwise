import {
  db,
  eq,
  rooms,
  and,
  roomStatusEnum,
  tenants,
  desc,
  asc,
} from "@reentwise/database";

export class RoomsService {
  async getPropertyRooms(propertyId: string) {
    try {
      const roomsResult = await db.query.rooms.findMany({
        where: eq(rooms.propertyId, propertyId),
        orderBy: asc(rooms.createdAt),
      });

      if (!roomsResult) {
        throw new Error("Rooms not found");
      }

      return roomsResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async getRoomById(propertyId: string, roomId: string) {
    try {
      const roomResult = await db.query.rooms.findFirst({
        where: and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)),
      });

      if (!roomResult) {
        throw new Error("Room not found");
      }

      // Also fetch the tenant(s) for this room. Usually there is only one active tenant.
      const tenantsResult = await db.query.tenants.findMany({
        where: eq(tenants.roomId, roomId),
      });

      return {
        ...roomResult,
        tenants: tenantsResult || [],
      };
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async createRoom(
    propertyId: string,
    body: {
      roomNumber: string;
      price: string;
      notes?: string;
    },
  ) {
    try {
      const roomResult = await db
        .insert(rooms)
        .values({
          propertyId,
          roomNumber: body.roomNumber,
          price: body.price.toString(),
          notes: body.notes,
        })
        .returning();

      if (!roomResult) {
        throw new Error("Failed to create room");
      }

      return roomResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async updateRoom(
    propertyId: string,
    roomId: string,
    body: {
      roomNumber?: string;
      price?: string;
      notes?: string;
    },
  ) {
    try {
      const roomResult = await db
        .update(rooms)
        .set({
          roomNumber: body.roomNumber,
          price: body.price?.toString(),
          notes: body.notes,
        })
        .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
        .returning();

      if (!roomResult) {
        throw new Error("Failed to update room");
      }

      return roomResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async deleteRoom(propertyId: string, roomId: string) {
    try {
      const roomResult = await db
        .delete(rooms)
        .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
        .returning();

      if (!roomResult) {
        throw new Error("Failed to delete room");
      }

      return roomResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async updateRoomStatus(propertyId: string, roomId: string, status: string) {
    try {
      type RoomStatus = (typeof roomStatusEnum.enumValues)[number];
      const typedStatus = status as RoomStatus;

      if (!roomStatusEnum.enumValues.includes(typedStatus)) {
        throw new Error("Invalid status");
      }

      const roomResult = await db
        .update(rooms)
        .set({ status: typedStatus })
        .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
        .returning();

      if (!roomResult) {
        throw new Error("Failed to update room status");
      }

      return roomResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }
}

export const roomsService = new RoomsService();
