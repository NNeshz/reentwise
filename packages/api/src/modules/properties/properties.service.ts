import {
  db,
  eq,
  properties,
  rooms,
  and,
  inArray,
  desc,
} from "@reentwise/database";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";

export class PropertiesService {
  async getOwnerProperties(ownerId: string) {
    try {
      const propertiesResult = await db
        .select()
        .from(properties)
        .where(eq(properties.ownerId, ownerId))
        .orderBy(desc(properties.createdAt));

      if (!propertiesResult || propertiesResult.length === 0) {
        return [];
      }

      const propertyIds = propertiesResult.map((property) => property.id);

      let roomsCounts = new Map<
        string,
        { totalRooms: number; occupiedRooms: number }
      >();

      if (propertyIds.length > 0) {
        const roomsResult = await db
          .select()
          .from(rooms)
          .where(inArray(rooms.propertyId, propertyIds));

        roomsCounts = roomsResult.reduce((acc, room) => {
          const current = acc.get(room.propertyId) ?? {
            totalRooms: 0,
            occupiedRooms: 0,
          };

          const updated = {
            totalRooms: current.totalRooms + 1,
            occupiedRooms:
              current.occupiedRooms + (room.status === "occupied" ? 1 : 0),
          };

          acc.set(room.propertyId, updated);
          return acc;
        }, new Map<string, { totalRooms: number; occupiedRooms: number }>());
      }

      const propertiesWithCounts = propertiesResult.map((property) => {
        const counts = roomsCounts.get(property.id) ?? {
          totalRooms: 0,
          occupiedRooms: 0,
        };

        return {
          id: property.id,
          name: property.name,
          address: property.address,
          totalRooms: counts.totalRooms,
          occupiedRooms: counts.occupiedRooms,
        };
      });

      return propertiesWithCounts;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async getPropertyById(ownerId: string, propertyId: string) {
    try {
      const [propertyResult] = await db
        .select()
        .from(properties)
        .where(
          and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
        );

      if (!propertyResult) {
        throw new Error("Property not found");
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
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async createProperty(
    ownerId: string,
    body: { name: string; address?: string },
  ) {
    try {
      const limitCheck = await planLimitsService.assertCanCreateProperty(
        ownerId,
      );
      if (!limitCheck.ok) {
        return { message: limitCheck.message, status: 402 };
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
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async updateProperty(
    ownerId: string,
    propertyId: string,
    body: { name?: string; address?: string },
  ) {
    try {
      const [propertyResult] = await db
        .update(properties)
        .set({ name: body.name, address: body.address })
        .where(
          and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
        )
        .returning();

      if (!propertyResult) {
        throw new Error("Failed to update property");
      }

      return propertyResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }

  async deleteProperty(ownerId: string, propertyId: string) {
    try {
      const [propertyResult] = await db
        .delete(properties)
        .where(
          and(eq(properties.id, propertyId), eq(properties.ownerId, ownerId)),
        )
        .returning();

      if (!propertyResult) {
        throw new Error("Failed to delete property");
      }

      return propertyResult;
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
      };
    }
  }
}

export const propertiesService = new PropertiesService();
