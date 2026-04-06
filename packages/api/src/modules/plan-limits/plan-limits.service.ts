import {
  and,
  count,
  db,
  eq,
  isNull,
  planLimits,
  properties,
  rooms,
  user,
} from "@reentwise/database";
import type { PlanTier } from "@reentwise/database";

const PAID_TIERS: PlanTier[] = ["basico", "pro", "patron"];

function isPaidProductTier(tier: PlanTier): boolean {
  return PAID_TIERS.includes(tier);
}

/**
 * Tier usado para límites y mensajería.
 * Si la suscripción figura como `canceled` pero aún hay `subscription_current_period_end`
 * en el futuro y el usuario conserva un plan de pago en BD, se mantiene ese tier hasta la fecha
 * (útil si el webhook o datos quedan desalineados un tiempo).
 */
export function getEffectivePlanTier(row: {
  subscriptionStatus: string | null;
  planTier: PlanTier;
  subscriptionCurrentPeriodEnd?: Date | null;
}): PlanTier {
  if (row.subscriptionStatus === "trialing") return "trial";
  if (
    row.subscriptionStatus === "active" ||
    row.subscriptionStatus === "past_due"
  ) {
    return row.planTier;
  }
  const end = row.subscriptionCurrentPeriodEnd;
  if (
    row.subscriptionStatus === "canceled" &&
    end &&
    end.getTime() > Date.now() &&
    isPaidProductTier(row.planTier)
  ) {
    return row.planTier;
  }
  return "freemium";
}

export class PlanLimitsService {
  async getLimitsContext(ownerId: string) {
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

  async assertCanCreateProperty(
    ownerId: string,
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    const ctx = await this.getLimitsContext(ownerId);
    if (!ctx) return { ok: false, message: "Usuario no encontrado" };

    const [row] = await db
      .select({ value: count() })
      .from(properties)
      .where(
        and(eq(properties.ownerId, ownerId), isNull(properties.archivedAt)),
      );
    const n = row?.value ?? 0;

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
      const [row] = await db
        .select({ value: count() })
        .from(rooms)
        .where(and(eq(rooms.propertyId, propertyId), isNull(rooms.archivedAt)));
      const n = row?.value ?? 0;

      if (n >= ctx.limits.maxRooms) {
        return {
          ok: false,
          message: `Has alcanzado el máximo de cuartos en esta propiedad (${ctx.limits.maxRooms}).`,
        };
      }
    } else {
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
      const n = row?.value ?? 0;

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
