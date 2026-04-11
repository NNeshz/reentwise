import { errorMessageFromUnknown } from "@/utils/normalize-error";
import { BILLING_CHECKOUT_PATH } from "@/modules/pricing/lib/pricing-api";

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
    throw new Error("No se recibió URL de checkout");
  }
  return url;
}

function isNetworkError(e: unknown): boolean {
  return (
    e instanceof TypeError &&
    typeof e.message === "string" &&
    (e.message.includes("fetch") || e.message.includes("Failed to fetch"))
  );
}

class PricingService {
  /**
   * Crea una sesión de checkout Polar en el backend y redirige.
   * En 401 redirige a auth (no lanza).
   */
  async startBillingCheckout(productId: string): Promise<void> {
    let res: Response;
    try {
      res = await fetch(BILLING_CHECKOUT_PATH, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } catch (e) {
      if (isNetworkError(e)) {
        throw new Error(
          "No se pudo conectar con la API. Comprueba que el backend esté en marcha y que `NEXT_PUBLIC_BACKEND_URL` en `.env` coincida con el servidor (Next reescribe `/api/*` hacia esa URL).",
        );
      }
      throw e;
    }

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
      throw toServiceError(json, "Error al crear la sesión de checkout");
    }

    const url = extractCheckoutUrl(json);
    window.location.href = url;
  }
}

export const pricingService = new PricingService();
