import {
  db,
  eq,
  rooms,
  and,
  roomStatusEnum,
  tenants,
  asc,
} from "@reentwise/database";
import {
  planLimitsService,
  PlanLimitExceededError,
} from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { RoomNotFoundError } from "@reentwise/api/src/modules/rooms/lib/room-not-found-error";
import { InvalidRoomStatusError } from "@reentwise/api/src/modules/rooms/lib/invalid-room-status-error";

export class RoomsService {
  async getPropertyRooms(propertyId: string) {
    return db.query.rooms.findMany({
      where: eq(rooms.propertyId, propertyId),
      orderBy: asc(rooms.createdAt),
    });
  }

  async getRoomById(propertyId: string, roomId: string) {
    const roomResult = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)),
    });

    if (!roomResult) {
      throw new RoomNotFoundError();
    }

    const tenantsResult = await db.query.tenants.findMany({
      where: eq(tenants.roomId, roomId),
    });

    return {
      ...roomResult,
      tenants: tenantsResult ?? [],
    };
  }

  async createRoom(
    ownerId: string,
    propertyId: string,
    body: {
      roomNumber: string;
      price: string;
      notes?: string;
    },
  ) {
    const limitCheck = await planLimitsService.assertCanCreateRoom(
      ownerId,
      propertyId,
    );
    if (!limitCheck.ok) {
      throw new PlanLimitExceededError(limitCheck.message);
    }

    const [created] = await db
      .insert(rooms)
      .values({
        propertyId,
        roomNumber: body.roomNumber,
        price: body.price.toString(),
        notes: body.notes,
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create room");
    }

    return created;
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
    const [updated] = await db
      .update(rooms)
      .set({
        roomNumber: body.roomNumber,
        price: body.price?.toString(),
        notes: body.notes,
      })
      .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
      .returning();

    if (!updated) {
      throw new RoomNotFoundError("Failed to update room");
    }

    return updated;
  }

  async deleteRoom(propertyId: string, roomId: string) {
    const [deleted] = await db
      .delete(rooms)
      .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
      .returning();

    if (!deleted) {
      throw new RoomNotFoundError("Failed to delete room");
    }

    return deleted;
  }

  async updateRoomStatus(propertyId: string, roomId: string, status: string) {
    type RoomStatus = (typeof roomStatusEnum.enumValues)[number];
    const typedStatus = status as RoomStatus;

    if (!roomStatusEnum.enumValues.includes(typedStatus)) {
      throw new InvalidRoomStatusError();
    }

    const [updated] = await db
      .update(rooms)
      .set({ status: typedStatus })
      .where(and(eq(rooms.id, roomId), eq(rooms.propertyId, propertyId)))
      .returning();

    if (!updated) {
      throw new RoomNotFoundError("Failed to update room status");
    }

    return updated;
  }
}

export const roomsService = new RoomsService();
