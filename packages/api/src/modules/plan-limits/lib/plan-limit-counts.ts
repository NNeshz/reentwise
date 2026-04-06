import {
  and,
  count,
  db,
  eq,
  isNull,
  properties,
  rooms,
} from "@reentwise/database";

export async function countActivePropertiesForOwner(
  ownerId: string,
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(properties)
    .where(
      and(eq(properties.ownerId, ownerId), isNull(properties.archivedAt)),
    );
  return row?.value ?? 0;
}

export async function countActiveRoomsOnProperty(
  propertyId: string,
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(rooms)
    .where(and(eq(rooms.propertyId, propertyId), isNull(rooms.archivedAt)));
  return row?.value ?? 0;
}

export async function countActiveRoomsForOwnerAcrossProperties(
  ownerId: string,
): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(rooms)
    .innerJoin(properties, eq(rooms.propertyId, properties.id))
    .where(
      and(
        eq(properties.ownerId, ownerId),
        isNull(properties.archivedAt),
        isNull(rooms.archivedAt),
      ),
    );
  return row?.value ?? 0;
}
