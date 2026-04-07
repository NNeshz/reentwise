import { errorMessageFromUnknown } from "@/utils/normalize-error";

function toServiceError(value: unknown, fallback: string): Error {
  return new Error(errorMessageFromUnknown(value, fallback));
}

function unwrapEnvelopeData(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  if (o.success === false && typeof o.message === "string") {
    throw new Error(o.message);
  }
  if ("data" in o) return o.data;
  return raw;
}

function extractCheckoutUrl(json: unknown): string {
  const payload = unwrapEnvelopeData(json);
  if (payload === null || typeof payload !== "object") {
    throw new Error("Respuesta inválida del servidor");
  }
  const o = payload as Record<string, unknown>;
  const url = o.url;
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("No se recibió URL de Stripe");
  }
  return url;
}

class PricingService {
  /**
   * Crea una Checkout Session en el backend y redirige al hosted checkout de Stripe.
   * En 401 redirige a auth (no lanza).
   */
  async startStripeCheckout(priceId: string): Promise<void> {
    const backendRaw = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof backendRaw !== "string" || !backendRaw.trim()) {
      throw new Error("Falta NEXT_PUBLIC_BACKEND_URL");
    }

    const backend = backendRaw.replace(/\/$/, "");
    const res = await fetch(`${backend}/api/stripe/crear-suscripcion`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    if (res.status === 401) {
      window.location.href = `/auth?next=${encodeURIComponent("/pricing")}`;
      return;
    }

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new Error("Respuesta inválida del servidor");
    }

    if (!res.ok) {
      throw toServiceError(json, "Error al crear la sesión de Stripe");
    }

    const url = extractCheckoutUrl(json);
    window.location.href = url;
  }
}

export const pricingService = new PricingService();
