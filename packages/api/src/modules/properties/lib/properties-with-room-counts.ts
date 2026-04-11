import type { rooms } from "@reentwise/database";

type PropertyRow = { id: string; name: string; address: string | null };

/** Aggregate room counts per property id from a flat room list. */
export function mapPropertiesWithRoomCounts(
  propertiesList: PropertyRow[],
  roomsList: (typeof rooms.$inferSelect)[],
): {
  id: string;
  name: string;
  address: string | null;
  totalRooms: number;
  occupiedRooms: number;
}[] {
  const roomsCounts = new Map<
    string,
    { totalRooms: number; occupiedRooms: number }
  >();

  for (const room of roomsList) {
    if (room.archivedAt) continue;
    const current = roomsCounts.get(room.propertyId) ?? {
      totalRooms: 0,
      occupiedRooms: 0,
    };
    roomsCounts.set(room.propertyId, {
      totalRooms: current.totalRooms + 1,
      occupiedRooms:
        current.occupiedRooms + (room.status === "occupied" ? 1 : 0),
    });
  }

  return propertiesList.map((property) => {
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
}
