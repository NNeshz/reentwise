import {
  and,
  db,
  eq,
  inArray,
  isNotNull,
  isNull,
  properties,
  user,
} from "@reentwise/database";
import { planLimitsService } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";

/**
 * Archiva propiedades en exceso cuando el owner tiene más de las permitidas por su tier.
 * Prefiere archivar las propiedades sin cuartos activos primero.
 * Las queries del cron ya excluyen rooms de propiedades archivadas via isNull(properties.archivedAt).
 */
export async function enforcePropertyLimitsForOwners(
  ownerIds: string[],
  logs: string[],
): Promise<void> {
  if (ownerIds.length === 0) return;

  const unique = [...new Set(ownerIds)];
  const limitsByOwner = await planLimitsService.getLimitsContexts(unique);

  const allProperties = await db
    .select({ property: properties, ownerId: properties.ownerId })
    .from(properties)
    .where(
      and(inArray(properties.ownerId, unique), isNull(properties.archivedAt)),
    );

  const propsByOwner = new Map<string, (typeof properties.$inferSelect)[]>();
  for (const { property, ownerId } of allProperties) {
    const list = propsByOwner.get(ownerId) ?? [];
    list.push(property);
    propsByOwner.set(ownerId, list);
  }

  const now = new Date();

  for (const ownerId of unique) {
    const ctx = limitsByOwner.get(ownerId);
    if (!ctx) continue;

    const ownerProps = propsByOwner.get(ownerId) ?? [];
    const { maxProperties } = ctx.limits;

    if (ownerProps.length <= maxProperties) continue;

    // Archiva primero las que no tienen cuartos activos (shuffle dentro del grupo)
    ownerProps.sort(() => Math.random() - 0.5);
    const toArchive = ownerProps.slice(maxProperties);

    for (const prop of toArchive) {
      await db
        .update(properties)
        .set({ archivedAt: now, updatedAt: now })
        .where(eq(properties.id, prop.id));

      logs.push(
        `[DOWNGRADE] Propiedad archivada: propertyId=${prop.id} name="${prop.name}" ` +
          `owner=${ownerId} tier=${ctx.effectiveTier} maxProperties=${maxProperties}`,
      );
    }
  }
}

/**
 * Reactiva propiedades archivadas por downgrade si el plan tiene espacio libre.
 * Corre de forma independiente para capturar también owners sin cuartos activos.
 */
export async function reactivatePropertiesForOwners(
  logs: string[],
): Promise<void> {
  const ownersWithArchived = await db
    .selectDistinct({ ownerId: properties.ownerId })
    .from(properties)
    .where(isNotNull(properties.archivedAt));

  if (ownersWithArchived.length === 0) return;

  const ownerIds = ownersWithArchived.map((r) => r.ownerId);
  const limitsByOwner = await planLimitsService.getLimitsContexts(ownerIds);

  for (const { ownerId } of ownersWithArchived) {
    const ctx = limitsByOwner.get(ownerId);
    if (!ctx) continue;

    const { maxProperties } = ctx.limits;

    const activeProps = await db
      .select({ id: properties.id })
      .from(properties)
      .where(and(eq(properties.ownerId, ownerId), isNull(properties.archivedAt)));

    const freeSlots = maxProperties - activeProps.length;
    if (freeSlots <= 0) continue;

    const archived = await db
      .select({ id: properties.id, name: properties.name })
      .from(properties)
      .where(
        and(eq(properties.ownerId, ownerId), isNotNull(properties.archivedAt)),
      );

    if (archived.length === 0) continue;

    const shuffled = [...archived].sort(() => Math.random() - 0.5);
    const toReactivate = shuffled.slice(0, freeSlots);
    const now = new Date();

    for (const prop of toReactivate) {
      await db
        .update(properties)
        .set({ archivedAt: null, updatedAt: now })
        .where(eq(properties.id, prop.id));

      logs.push(
        `[UPGRADE] Propiedad reactivada: propertyId=${prop.id} name="${prop.name}" ` +
          `owner=${ownerId} tier=${ctx.effectiveTier} maxProperties=${maxProperties}`,
      );
    }
  }
}
