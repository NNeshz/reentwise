import Stripe from "stripe";
import { db, eq, user } from "@reentwise/database";
import { env } from "@reentwise/api/src/utils/envs";
import { StripeNotConfiguredError } from "@reentwise/api/src/modules/stripe/lib/stripe-not-configured-error";
import { InvalidStripePriceError } from "@reentwise/api/src/modules/stripe/lib/invalid-stripe-price-error";
import {
  configuredStripePriceIds,
  mapStripeSubscriptionStatus,
  periodEndFromSubscription,
  planTierFromPriceId,
} from "@reentwise/api/src/modules/stripe/lib/stripe-subscription-sync";

export type { SubscriptionStatus } from "@reentwise/api/src/modules/stripe/lib/stripe-subscription-sync";

const API_VERSION = "2026-03-25.dahlia" as const;

let stripeSingleton: Stripe | null = null;

function getStripe(): Stripe {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new StripeNotConfiguredError(
      "STRIPE_SECRET_KEY no está configurada",
    );
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, { apiVersion: API_VERSION });
  }
  return stripeSingleton;
}

export function constructStripeWebhookEvent(
  rawBody: string,
  signature: string,
  endpointSecret: string,
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    rawBody,
    signature,
    endpointSecret,
  );
}

export class StripeService {
  async createCheckoutSession(input: { userId: string; priceId: string }) {
    const allowed = configuredStripePriceIds();
    if (allowed.length > 0 && !allowed.includes(input.priceId)) {
      throw new InvalidStripePriceError();
    }

    const stripe = getStripe();
    const baseUrl = env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: input.priceId, quantity: 1 }],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 30,
      },
      client_reference_id: input.userId,
      success_url: `${baseUrl}/exito`,
      cancel_url: `${baseUrl}/cancelado`,
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió URL de sesión");
    }

    return { url: session.url };
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.onCheckoutSessionCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await this.onSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await this.onSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRaw = invoice.parent?.subscription_details?.subscription;
        const subId =
          typeof subRaw === "string" ? subRaw : subRaw?.id ?? null;
        if (subId) {
          await db
            .update(user)
            .set({
              subscriptionStatus: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(user.stripeSubscriptionId, subId));
        }
        console.warn(
          `[Stripe] invoice.payment_failed subscription=${subId ?? "?"}`,
        );
        break;
      }
      default:
        console.log(`[Stripe] Evento no manejado: ${event.type}`);
    }
  }

  private async onCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id;
    if (!userId) {
      console.warn("[Stripe] checkout.session.completed sin client_reference_id");
      return;
    }

    const customerRaw = session.customer;
    const subscriptionRaw = session.subscription;
    const customerId =
      typeof customerRaw === "string" ? customerRaw : customerRaw?.id;
    const subscriptionId =
      typeof subscriptionRaw === "string"
        ? subscriptionRaw
        : subscriptionRaw?.id;

    if (!customerId || !subscriptionId) {
      console.warn("[Stripe] checkout sin customer o subscription");
      return;
    }

    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price"],
    });

    const priceId = subscription.items.data[0]?.price?.id;
    const tier = planTierFromPriceId(priceId);

    await db
      .update(user)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
        ...(tier ? { planTier: tier } : {}),
        stripePriceId: priceId ?? null,
        subscriptionCurrentPeriodEnd: periodEndFromSubscription(subscription),
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  private async onSubscriptionUpdated(subscription: Stripe.Subscription) {
    const priceId = subscription.items.data[0]?.price?.id;
    const tier = planTierFromPriceId(priceId);

    const [row] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.stripeSubscriptionId, subscription.id))
      .limit(1);

    if (!row) {
      console.warn(
        `[Stripe] subscription.updated sin usuario local: ${subscription.id}`,
      );
      return;
    }

    await db
      .update(user)
      .set({
        subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
        ...(tier ? { planTier: tier } : {}),
        stripePriceId: priceId ?? null,
        subscriptionCurrentPeriodEnd: periodEndFromSubscription(subscription),
        updatedAt: new Date(),
      })
      .where(eq(user.id, row.id));
  }

  private async onSubscriptionDeleted(subscription: Stripe.Subscription) {
    await db
      .update(user)
      .set({
        stripeSubscriptionId: null,
        subscriptionStatus: "canceled",
        planTier: "freemium",
        stripePriceId: null,
        subscriptionCurrentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .where(eq(user.stripeSubscriptionId, subscription.id));
  }
}

export const stripeService = new StripeService();
