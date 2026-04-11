import { Polar } from "@polar-sh/sdk";
import { Webhook, WebhookVerificationError } from "standardwebhooks";
import { and, db, eq, user, type PlanTier } from "@reentwise/database";
import { env } from "@reentwise/api/src/utils/envs";
import { BillingActivePolarSubscriptionError } from "@reentwise/api/src/modules/billing/lib/billing-active-polar-subscription-error";
import { BillingNotConfiguredError } from "@reentwise/api/src/modules/billing/lib/billing-not-configured-error";
import { InvalidBillingProductError } from "@reentwise/api/src/modules/billing/lib/invalid-billing-product-error";
import {
  configuredProductIds,
  mapProviderSubscriptionStatus,
  planTierFromProductId,
  type SubscriptionStatus,
} from "@reentwise/api/src/modules/billing/lib/billing-subscription-sync";
import {
  asRecord,
  parseIsoDate,
  readNestedCustomerExternalId,
  readPolarProductId,
  readTrimmedString,
  userIdFromMetadata,
} from "@reentwise/api/src/modules/billing/lib/billing-webhook-payload";

let polarSingleton: Polar | null = null;

function isPolarResourceNotFound(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "error" in e &&
    (e as { error: string }).error === "ResourceNotFound"
  );
}

function isPolarHttpLikeError(
  e: unknown,
): e is { message: string; body: string } {
  if (typeof e !== "object" || e === null) return false;
  const o = e as Record<string, unknown>;
  return (
    typeof o.message === "string" &&
    typeof o.body === "string"
  );
}

/** Subconjunto del modelo Polar `active_subscriptions` (evita imports profundos del SDK). */
type PolarActiveSubscriptionRow = {
  id: string;
  productId: string;
  status: string;
  currentPeriodEnd: Date;
};

function getPolar(): Polar {
  const key = env.POLAR_ACCESS_TOKEN;
  if (!key?.trim()) {
    throw new BillingNotConfiguredError("POLAR_ACCESS_TOKEN no está configurada");
  }
  if (!polarSingleton) {
    polarSingleton = new Polar({
      accessToken: key,
      server: env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
    });
  }
  return polarSingleton;
}

export class BillingService {
  private static readonly ACTIVE_SUB_CHECKOUT_MESSAGE =
    "Polar ya tiene una suscripción activa o en prueba vinculada a tu cuenta. Hemos actualizado tu plan en la aplicación. Para contratar otro producto, cancela la suscripción actual en el portal de Polar o cámbiala desde ahí.";

  /**
   * Aplica una fila de `active_subscriptions` de Polar al usuario local (misma lógica
   * que el webhook `customer.state_changed`).
   */
  private async applyPolarActiveSubscriptionToUser(
    userId: string,
    polarCustomerId: string,
    sub: PolarActiveSubscriptionRow,
  ): Promise<void> {
    const tier = planTierFromProductId(sub.productId);
    const mapped = mapProviderSubscriptionStatus(
      String(sub.status),
    ) as SubscriptionStatus;

    await db
      .update(user)
      .set({
        billingCustomerId: polarCustomerId,
        billingSubscriptionId: sub.id,
        billingPriceId: sub.productId,
        subscriptionStatus: mapped,
        ...(tier ? { planTier: tier as PlanTier } : {}),
        subscriptionCurrentPeriodEnd: sub.currentPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  /**
   * Si existe cliente Polar por `external_id` = userId y tiene suscripciones activas,
   * sincroniza la BD local.
   */
  private async syncLocalUserFromPolarIfActive(userId: string): Promise<void> {
    try {
      const polar = getPolar();
      const state = await polar.customers.getStateExternal({
        externalId: userId,
      });
      if (state.type !== "individual" && state.type !== "team") {
        return;
      }
      const subs = state.activeSubscriptions;
      if (!subs.length) return;
      await this.applyPolarActiveSubscriptionToUser(
        userId,
        state.id,
        subs[0]!,
      );
    } catch (e) {
      if (isPolarResourceNotFound(e)) return;
      console.warn("[billing] syncLocalUserFromPolarIfActive:", e);
    }
  }

  private isPolarActiveSubscriptionCheckoutError(e: unknown): boolean {
    if (!isPolarHttpLikeError(e)) return false;
    const combined = `${e.message}\n${e.body}`;
    return /already have an active subscription/i.test(combined);
  }

  async createCheckoutSession(input: { userId: string; productId: string }) {
    const allowed = configuredProductIds();
    if (allowed.length > 0 && !allowed.includes(input.productId)) {
      throw new InvalidBillingProductError();
    }

    const polar = getPolar();
    const baseUrl = env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, "");

    try {
      const state = await polar.customers.getStateExternal({
        externalId: input.userId,
      });
      if (state.type === "individual" || state.type === "team") {
        if (state.activeSubscriptions.length > 0) {
          await this.applyPolarActiveSubscriptionToUser(
            input.userId,
            state.id,
            state.activeSubscriptions[0]!,
          );
          throw new BillingActivePolarSubscriptionError(
            BillingService.ACTIVE_SUB_CHECKOUT_MESSAGE,
          );
        }
      }
    } catch (e) {
      if (e instanceof BillingActivePolarSubscriptionError) throw e;
      if (isPolarResourceNotFound(e)) {
        // Aún no hay cliente en Polar con este external_id: checkout puede crearse.
      } else {
        console.warn("[billing] getStateExternal antes de checkout:", e);
      }
    }

    try {
      const checkout = await polar.checkouts.create({
        products: [input.productId],
        externalCustomerId: input.userId,
        metadata: { user_id: input.userId },
        successUrl: `${baseUrl}/exito`,
        returnUrl: `${baseUrl}/cancelado`,
        trialInterval: "day",
        trialIntervalCount: 30,
        allowTrial: true,
      });

      if (!checkout.url?.trim()) {
        throw new Error("Polar no devolvió URL de checkout");
      }

      return { url: checkout.url };
    } catch (e) {
      if (this.isPolarActiveSubscriptionCheckoutError(e)) {
        await this.syncLocalUserFromPolarIfActive(input.userId);
        throw new BillingActivePolarSubscriptionError(
          BillingService.ACTIVE_SUB_CHECKOUT_MESSAGE,
        );
      }
      throw e;
    }
  }

  async handleWebhookRequest(request: Request, rawBody: string) {
    const secret = env.POLAR_WEBHOOK_SECRET;
    if (!secret?.trim()) {
      throw new BillingNotConfiguredError("POLAR_WEBHOOK_SECRET no está configurada");
    }

    const webhookId = request.headers.get("webhook-id");
    const webhookTimestamp = request.headers.get("webhook-timestamp");
    const webhookSignature = request.headers.get("webhook-signature");
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      throw new Error("Faltan cabeceras webhook-id / webhook-timestamp / webhook-signature");
    }

    // Polar usa `polar_whs_*`; standardwebhooks solo entiende `whsec_` + base64 del
    // material clave. El SDK de Polar re-encodea el secreto UTF-8 entero a base64.
    const wh = new Webhook(
      Buffer.from(secret.trim(), "utf8").toString("base64"),
    );
    let event: { type: string; data: unknown };
    try {
      event = wh.verify(rawBody, {
        "webhook-id": webhookId,
        "webhook-timestamp": webhookTimestamp,
        "webhook-signature": webhookSignature,
      }) as { type: string; data: unknown };
    } catch (e) {
      if (e instanceof WebhookVerificationError) {
        throw e;
      }
      console.warn("[billing] Webhook: payload no reconocido o inválido", e);
      return;
    }

    const data = event.data;

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.active":
      case "subscription.uncanceled":
      case "subscription.past_due":
        await this.syncFromFullSubscription(data);
        break;
      case "subscription.canceled":
        await this.onSubscriptionCanceled(data);
        break;
      case "subscription.revoked": {
        const sub = asRecord(data);
        const id = sub ? readTrimmedString(sub, "id") : null;
        if (id) await this.onSubscriptionRevoked(id);
        break;
      }
      case "order.paid":
      case "order.created":
      case "order.updated":
        await this.syncFromOrderRecord(data);
        break;
      case "customer.created":
      case "customer.updated":
        await this.onPolarCustomerUpsert(data);
        break;
      case "customer.state_changed":
        await this.onPolarCustomerStateChanged(data);
        break;
      case "checkout.created":
      case "checkout.updated":
        await this.onCheckoutPayload(data);
        break;
      case "member.created":
        await this.onMemberCreated(data);
        break;
      default:
        console.log(`[billing] Evento no manejado: ${event.type}`);
    }
  }

  /** Resuelve `user.id` local desde payload de suscripción (snake_case o camelCase). */
  private async resolveUserIdFromSubscriptionPayload(
    sub: Record<string, unknown>,
  ): Promise<string | null> {
    const customer = asRecord(sub.customer ?? sub["customer"]);
    const ext = customer
      ? readTrimmedString(customer, "external_id", "externalId")
      : null;
    if (ext) return ext;
    const fromMeta = userIdFromMetadata(sub.metadata ?? sub["metadata"]);
    if (fromMeta) return fromMeta;

    const subId = readTrimmedString(sub, "id");
    if (!subId) return null;
    const [row] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.billingSubscriptionId, subId))
      .limit(1);
    return row?.id ?? null;
  }

  private async syncFromFullSubscription(raw: unknown) {
    const sub = asRecord(raw);
    if (!sub) return;

    const id = readTrimmedString(sub, "id");
    const customerId = readTrimmedString(sub, "customer_id", "customerId");
    const productId = readPolarProductId(sub);
    const status = readTrimmedString(sub, "status") ?? "active";
    const end = parseIsoDate(sub.current_period_end ?? sub.currentPeriodEnd);
    if (!id || !customerId || !productId || !end) return;

    const userId = await this.resolveUserIdFromSubscriptionPayload(sub);
    if (!userId) {
      console.warn(`[billing] Suscripción sin usuario local: ${id}`);
      return;
    }

    const tier = planTierFromProductId(productId);
    await db
      .update(user)
      .set({
        billingCustomerId: customerId,
        billingSubscriptionId: id,
        subscriptionStatus: mapProviderSubscriptionStatus(status),
        ...(tier ? { planTier: tier } : {}),
        billingPriceId: productId,
        subscriptionCurrentPeriodEnd: end,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  private async onSubscriptionCanceled(raw: unknown) {
    const sub = asRecord(raw);
    if (!sub) return;
    const subId = readTrimmedString(sub, "id");
    if (!subId) return;

    const userId = await this.resolveUserIdFromSubscriptionPayload(sub);
    const cond = userId
      ? eq(user.id, userId)
      : eq(user.billingSubscriptionId, subId);

    await db
      .update(user)
      .set({
        subscriptionStatus: "canceled",
        updatedAt: new Date(),
      })
      .where(cond);
  }

  private async onSubscriptionRevoked(subscriptionId: string) {
    await db
      .update(user)
      .set({
        billingSubscriptionId: null,
        subscriptionStatus: "canceled",
        planTier: "freemium",
        billingPriceId: null,
        subscriptionCurrentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .where(eq(user.billingSubscriptionId, subscriptionId));
  }

  /** Órdenes pagadas (y actualizaciones con `paid: true`) con suscripción embebida. */
  private async syncFromOrderRecord(raw: unknown) {
    const order = asRecord(raw);
    if (!order) return;
    if (order.paid !== true) return;

    const sub = asRecord(order.subscription ?? order["subscription"]);
    const subscriptionId = readTrimmedString(
      order,
      "subscription_id",
      "subscriptionId",
    );
    if (!sub || !subscriptionId) return;

    const userId =
      readNestedCustomerExternalId(order) ??
      userIdFromMetadata(order.metadata ?? order["metadata"]);
    if (!userId) return;

    const customerId = readTrimmedString(order, "customer_id", "customerId");
    if (!customerId) return;

    const subInnerId = readTrimmedString(sub, "id");
    const productId = readPolarProductId(sub);
    const status = readTrimmedString(sub, "status") ?? "active";
    const end = parseIsoDate(sub.current_period_end ?? sub.currentPeriodEnd);
    if (!subInnerId || !productId || !end) return;

    const tier = planTierFromProductId(productId);
    await db
      .update(user)
      .set({
        billingCustomerId: customerId,
        billingSubscriptionId: subInnerId,
        subscriptionStatus: mapProviderSubscriptionStatus(status),
        ...(tier ? { planTier: tier } : {}),
        billingPriceId: productId,
        subscriptionCurrentPeriodEnd: end,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  /** Enlaza `billing_customer_id` al crear/actualizar cliente en Polar. */
  private async onPolarCustomerUpsert(raw: unknown) {
    const data = asRecord(raw);
    if (!data) return;
    const userId = readTrimmedString(data, "external_id", "externalId");
    const polarCustomerId = readTrimmedString(data, "id");
    if (!userId || !polarCustomerId) return;

    await db
      .update(user)
      .set({
        billingCustomerId: polarCustomerId,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  /**
   * Estado agregado del cliente (suscripciones activas). Si no hay ninguna,
   * limpia la suscripción local si el cliente Polar coincide.
   */
  private async onPolarCustomerStateChanged(raw: unknown) {
    const data = asRecord(raw);
    if (!data) return;

    const userId = readTrimmedString(data, "external_id", "externalId");
    const polarCustomerId = readTrimmedString(data, "id");
    if (!userId || !polarCustomerId) return;

    const subsRaw = data.active_subscriptions ?? data.activeSubscriptions;
    if (!Array.isArray(subsRaw) || subsRaw.length === 0) {
      await db
        .update(user)
        .set({
          billingSubscriptionId: null,
          subscriptionStatus: "canceled",
          planTier: "freemium",
          billingPriceId: null,
          subscriptionCurrentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(user.id, userId),
            eq(user.billingCustomerId, polarCustomerId),
          ),
        );
      return;
    }

    const first = asRecord(subsRaw[0]);
    if (!first) return;

    const subId = readTrimmedString(first, "id");
    const productId = readPolarProductId(first);
    const status = readTrimmedString(first, "status") ?? "active";
    const end = parseIsoDate(first.current_period_end ?? first.currentPeriodEnd);
    if (!subId || !productId || !end) return;

    const tier = planTierFromProductId(productId);
    const mapped = mapProviderSubscriptionStatus(status) as SubscriptionStatus;

    await db
      .update(user)
      .set({
        billingCustomerId: polarCustomerId,
        billingSubscriptionId: subId,
        billingPriceId: productId,
        subscriptionStatus: mapped,
        ...(tier ? { planTier: tier as PlanTier } : {}),
        subscriptionCurrentPeriodEnd: end,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  /** Progreso del checkout: cliente Polar; si `succeeded`, suscripción y plan. */
  private async onCheckoutPayload(raw: unknown) {
    const data = asRecord(raw);
    if (!data) return;

    const userId =
      readTrimmedString(
        data,
        "external_customer_id",
        "externalCustomerId",
      ) ?? userIdFromMetadata(data.metadata ?? data["metadata"]);
    if (!userId) return;

    const customerId = readTrimmedString(data, "customer_id", "customerId");
    const status = readTrimmedString(data, "status");
    const subscriptionId = readTrimmedString(
      data,
      "subscription_id",
      "subscriptionId",
    );
    const productId = readPolarProductId(data);

    const patch: {
      updatedAt: Date;
      billingCustomerId?: string;
      billingSubscriptionId?: string;
      billingPriceId?: string;
      planTier?: PlanTier;
      subscriptionStatus?: SubscriptionStatus;
    } = { updatedAt: new Date() };

    if (customerId) patch.billingCustomerId = customerId;

    if (status === "succeeded") {
      if (subscriptionId) patch.billingSubscriptionId = subscriptionId;
      if (productId) {
        patch.billingPriceId = productId;
        const tier = planTierFromProductId(productId);
        if (tier) patch.planTier = tier;
      }
      const nestedSub = asRecord(data.subscription ?? data["subscription"]);
      const polarSubStatus = nestedSub
        ? readTrimmedString(nestedSub, "status")
        : null;
      patch.subscriptionStatus = polarSubStatus
        ? mapProviderSubscriptionStatus(polarSubStatus)
        : "trialing";
    }

    await db.update(user).set(patch).where(eq(user.id, userId));
  }

  /** Miembro de organización Polar con `external_id` = nuestro `user.id`. */
  private async onMemberCreated(raw: unknown) {
    const data = asRecord(raw);
    if (!data) return;
    const userId = readTrimmedString(data, "external_id", "externalId");
    const customerId = readTrimmedString(data, "customer_id", "customerId");
    if (!userId || !customerId) return;

    await db
      .update(user)
      .set({
        billingCustomerId: customerId,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }
}

export const billingService = new BillingService();
