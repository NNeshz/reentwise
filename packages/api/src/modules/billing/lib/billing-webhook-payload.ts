/** Polar envía JSON con snake_case; el SDK remap-ea a camelCase. Aceptamos ambos. */

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function readTrimmedString(
  obj: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

export function parseIsoDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function userIdFromMetadata(meta: unknown): string | null {
  const m = asRecord(meta);
  if (!m) return null;
  return readTrimmedString(m, "user_id", "userId");
}

export function readNestedCustomerExternalId(
  order: Record<string, unknown>,
): string | null {
  const c = asRecord(order.customer ?? order["customer"]);
  if (!c) return null;
  return readTrimmedString(c, "external_id", "externalId");
}

/**
 * Polar puede enviar `product_id` plano o una lista `products` en checkout/suscripción.
 */
export function readPolarProductId(obj: Record<string, unknown>): string | null {
  const direct = readTrimmedString(obj, "product_id", "productId");
  if (direct) return direct;
  const products = obj.products ?? obj["products"];
  if (!Array.isArray(products) || products.length === 0) return null;
  const first = products[0];
  if (typeof first === "string" && first.trim()) return first.trim();
  const rec = asRecord(first);
  return rec ? readTrimmedString(rec, "product_id", "productId", "id") : null;
}
