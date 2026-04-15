import {
  and,
  db,
  eq,
  inArray,
  isNull,
  properties,
  rooms,
} from "@reentwise/database";
import type { OwnerPlanLimitsContext } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";

/**
 * Chequea si algún owner tiene más cuartos activos que su plan permite.
 * Si es así, archiva aleatoriamente los cuartos en exceso.
 * Esto detiene los mensajes automáticamente (la query del cron excluye archivedAt IS NOT NULL).
 */
export async function enforceRoomLimitsForOwners(
  ownerIds: string[],
  limitsByOwner: Map<string, OwnerPlanLimitsContext>,
  logs: string[],
): Promise<void> {
  if (ownerIds.length === 0) return;

  const unique = [...new Set(ownerIds)];

  const allRooms = await db
    .select({
      room: rooms,
      ownerId: properties.ownerId,
    })
    .from(rooms)
    .innerJoin(properties, eq(rooms.propertyId, properties.id))
    .where(
      and(
        inArray(properties.ownerId, unique),
        isNull(rooms.archivedAt),
        isNull(properties.archivedAt),
      ),
    );

  const roomsByOwner = new Map<string, (typeof rooms.$inferSelect)[]>();
  for (const { room, ownerId } of allRooms) {
    const list = roomsByOwner.get(ownerId) ?? [];
    list.push(room);
    roomsByOwner.set(ownerId, list);
  }

  for (const ownerId of unique) {
    const ctx = limitsByOwner.get(ownerId);
    if (!ctx) continue;

    const ownerRooms = roomsByOwner.get(ownerId) ?? [];
    const { maxRooms } = ctx.limits;

    if (ownerRooms.length <= maxRooms) continue;

    // Orden aleatorio; los que superan el límite se archivan
    const shuffled = [...ownerRooms].sort(() => Math.random() - 0.5);
    const toArchive = shuffled.slice(maxRooms);
    const now = new Date();

    for (const room of toArchive) {
      await db
        .update(rooms)
        .set({ archivedAt: now, updatedAt: now })
        .where(eq(rooms.id, room.id));

      logs.push(
        `[DOWNGRADE] Cuarto archivado: roomId=${room.id} roomNumber=${room.roomNumber} ` +
          `owner=${ownerId} tier=${ctx.effectiveTier} maxRooms=${maxRooms}`,
      );
    }
  }
}
