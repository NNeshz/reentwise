import {
  and,
  db,
  eq,
  isNotNull,
  isNull,
  properties,
  rooms,
  user,
} from "@reentwise/database";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";

/**
 * Reactiva cuartos archivados por downgrade cuando el owner tiene capacidad libre
 * según su tier efectivo actual.
 *
 * Ejemplo: tenía patrón (25), bajó a freemium (2 activos, 23 archivados),
 * volvió a pagar pro (15) → reactiva 13 cuartos al azar de los 23 archivados.
 *
 * Se ejecuta desde el cron diario, independientemente de qué owners tienen
 * inquilinos activos (un owner puede tener todos sus cuartos archivados).
 */
export async function reactivateRoomsForOwners(logs: string[]): Promise<void> {
  // Owners con al menos un cuarto archivado en una propiedad no archivada
  const ownersWithArchived = await db
    .selectDistinct({ ownerId: properties.ownerId })
    .from(rooms)
    .innerJoin(properties, eq(rooms.propertyId, properties.id))
    .where(and(isNotNull(rooms.archivedAt), isNull(properties.archivedAt)));

  if (ownersWithArchived.length === 0) return;

  const ownerIds = ownersWithArchived.map((r) => r.ownerId);
  const limitsByOwner = await planLimitsService.getLimitsContexts(ownerIds);

  for (const { ownerId } of ownersWithArchived) {
    const ctx = limitsByOwner.get(ownerId);
    if (!ctx) continue;

    const { maxRooms } = ctx.limits;

    // Cuartos activos (no archivados, propiedad no archivada)
    const activeRooms = await db
      .select({ id: rooms.id })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(properties.ownerId, ownerId),
          isNull(rooms.archivedAt),
          isNull(properties.archivedAt),
        ),
      );

    const freeSlots = maxRooms - activeRooms.length;
    if (freeSlots <= 0) continue;

    // Cuartos archivados disponibles para reactivar
    const archivedRooms = await db
      .select({ id: rooms.id, roomNumber: rooms.roomNumber })
      .from(rooms)
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(
        and(
          eq(properties.ownerId, ownerId),
          isNotNull(rooms.archivedAt),
          isNull(properties.archivedAt),
        ),
      );

    if (archivedRooms.length === 0) continue;

    // Selección aleatoria de cuántos reactivar
    const shuffled = [...archivedRooms].sort(() => Math.random() - 0.5);
    const toReactivate = shuffled.slice(0, freeSlots);
    const now = new Date();

    for (const room of toReactivate) {
      await db
        .update(rooms)
        .set({ archivedAt: null, updatedAt: now })
        .where(eq(rooms.id, room.id));

      logs.push(
        `[UPGRADE] Cuarto reactivado: roomId=${room.id} roomNumber=${room.roomNumber} ` +
          `owner=${ownerId} tier=${ctx.effectiveTier} maxRooms=${maxRooms}`,
      );
    }
  }
}
