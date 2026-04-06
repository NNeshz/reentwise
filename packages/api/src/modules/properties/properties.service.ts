import {
  db,
  eq,
  properties,
  rooms,
  and,
  inArray,
  desc,
} from "@reentwise/database";
import {
  planLimitsService,
  PlanLimitExceededError,
} from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { PropertyNotFoundError } from "@reentwise/api/src/modules/properties/lib/property-not-found-error";
import { mapPropertiesWithRoomCounts } from "@reentwise/api/src/modules/properties/lib/properties-with-room-counts";

export class PropertiesService {
  async getOwnerProperties(ownerId: string) {
    const propertiesResult = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId))
      .orderBy(desc(properties.createdAt));

    if (propertiesResult.length === 0) {
      return [];
    }

    const propertyIds = propertiesResult.map((p) => p.id);
    const roomsResult =
      propertyIds.length > 0
        ? await db
            .select()
            .from(rooms)
            .where(inArray(rooms.propertyId, propertyIds))
        : [];

    return mapPropertiesWithRoomCounts(propertiesResult, roomsResult);
  }

  async getPropertyById(ownerId: string, propertyId: string) {
    const [propertyResult] = await db
      .select()
      .from(properties)
      .where(
        and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
      );

    if (!propertyResult) {
      throw new PropertyNotFoundError();
    }

    const roomsResult = await db
      .select()
      .from(rooms)
      .where(eq(rooms.propertyId, propertyId));

    const totalRooms = roomsResult.length;
    const occupiedRooms = roomsResult.filter(
      (room) => room.status === "occupied",
    ).length;

    return {
      id: propertyResult.id,
      name: propertyResult.name,
      address: propertyResult.address,
      totalRooms,
      occupiedRooms,
    };
  }

  async createProperty(
    ownerId: string,
    body: { name: string; address?: string },
  ) {
    const limitCheck = await planLimitsService.assertCanCreateProperty(ownerId);
    if (!limitCheck.ok) {
      throw new PlanLimitExceededError(limitCheck.message);
    }

    const [propertyResult] = await db
      .insert(properties)
      .values({
        ownerId,
        name: body.name,
        address: body.address,
      })
      .returning();

    if (!propertyResult) {
      throw new Error("Failed to create property");
    }

    return propertyResult;
  }

  async updateProperty(
    ownerId: string,
    propertyId: string,
    body: { name?: string; address?: string },
  ) {
    const [propertyResult] = await db
      .update(properties)
      .set({ name: body.name, address: body.address })
      .where(
        and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
      )
      .returning();

    if (!propertyResult) {
      throw new PropertyNotFoundError("Failed to update property");
    }

    return propertyResult;
  }

  async deleteProperty(ownerId: string, propertyId: string) {
    const [propertyResult] = await db
      .delete(properties)
      .where(
        and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
      )
      .returning();

    if (!propertyResult) {
      throw new PropertyNotFoundError("Failed to delete property");
    }

    return propertyResult;
  }
}

export const propertiesService = new PropertiesService();
