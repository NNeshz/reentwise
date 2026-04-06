import {
  and,
  db,
  eq,
  inArray,
  isNull,
  planLimits,
  properties,
  user,
} from "@reentwise/database";
import type { PlanTier } from "@reentwise/database";
import { getEffectivePlanTier } from "@reentwise/api/src/modules/plan-limits/lib/effective-plan-tier";
import {
  countActivePropertiesForOwner,
  countActiveRoomsForOwnerAcrossProperties,
  countActiveRoomsOnProperty,
} from "@reentwise/api/src/modules/plan-limits/lib/plan-limit-counts";
import type { OwnerPlanLimitsContext } from "@reentwise/api/src/modules/plan-limits/types/plan-limits.types";

export { getEffectivePlanTier } from "@reentwise/api/src/modules/plan-limits/lib/effective-plan-tier";
export type {
  EffectivePlanUserRow,
  OwnerPlanLimitsContext,
} from "@reentwise/api/src/modules/plan-limits/types/plan-limits.types";

export class PlanLimitsService {
  async getLimitsContext(
    ownerId: string,
  ): Promise<OwnerPlanLimitsContext | null> {
    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.id, ownerId))
      .limit(1);
    if (!u) return null;
    const effectiveTier = getEffectivePlanTier(u);
    const [limits] = await db
      .select()
      .from(planLimits)
      .where(eq(planLimits.tier, effectiveTier))
      .limit(1);
    if (!limits) return null;
    return { user: u, effectiveTier, limits };
  }

  /**
   * Batch-resolve limits (one `user` query + one `plan_limits` by distinct tiers).
   * Prefer over per-row `getLimitsContext` in cron-style loops.
   */
  async getLimitsContexts(
    ownerIds: string[],
  ): Promise<Map<string, OwnerPlanLimitsContext>> {
    const unique = [...new Set(ownerIds.filter(Boolean))];
    const out = new Map<string, OwnerPlanLimitsContext>();
    if (unique.length === 0) return out;

    const usersFound = await db
      .select()
      .from(user)
      .where(inArray(user.id, unique));

    const byId = new Map(usersFound.map((u) => [u.id, u]));
    const tiersNeeded = new Set<PlanTier>();
    for (const id of unique) {
      const row = byId.get(id);
      if (row) tiersNeeded.add(getEffectivePlanTier(row));
    }

    const tierList = [...tiersNeeded];
    const limitsRows =
      tierList.length === 0
        ? []
        : await db
            .select()
            .from(planLimits)
            .where(inArray(planLimits.tier, tierList));

    const limitsByTier = new Map(
      limitsRows.map((row) => [row.tier, row] as const),
    );

    for (const id of unique) {
      const u = byId.get(id);
      if (!u) continue;
      const effectiveTier = getEffectivePlanTier(u);
      const limits = limitsByTier.get(effectiveTier);
      if (!limits) continue;
      out.set(id, { user: u, effectiveTier, limits });
    }

    return out;
  }

  async assertCanCreateProperty(
    ownerId: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    const ctx = await this.getLimitsContext(ownerId);
    if (!ctx) return { ok: false, message: "Usuario no encontrado" };

    const n = await countActivePropertiesForOwner(ownerId);

    if (n >= ctx.limits.maxProperties) {
      return {
        ok: false,
        message: `Has alcanzado el máximo de propiedades para tu plan (${ctx.limits.maxProperties}).`,
      };
    }
    return { ok: true };
  }

  async assertCanCreateRoom(
    ownerId: string,
    propertyId: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    const ctx = await this.getLimitsContext(ownerId);
    if (!ctx) return { ok: false, message: "Usuario no encontrado" };

    const [prop] = await db
      .select({ id: properties.id })
      .from(properties)
      .where(
        and(
          eq(properties.id, propertyId),
          eq(properties.ownerId, ownerId),
          isNull(properties.archivedAt),
        ),
      )
      .limit(1);

    if (!prop) {
      return { ok: false, message: "Propiedad no encontrada" };
    }

    if (ctx.limits.roomsLimitMode === "per_property") {
      const n = await countActiveRoomsOnProperty(propertyId);

      if (n >= ctx.limits.maxRooms) {
        return {
          ok: false,
          message: `Has alcanzado el máximo de cuartos en esta propiedad (${ctx.limits.maxRooms}).`,
        };
      }
    } else {
      const n = await countActiveRoomsForOwnerAcrossProperties(ownerId);

      if (n >= ctx.limits.maxRooms) {
        return {
          ok: false,
          message: `Has alcanzado el máximo de cuartos en tu plan (${ctx.limits.maxRooms}).`,
        };
      }
    }

    return { ok: true };
  }
}

export const planLimitsService = new PlanLimitsService();
