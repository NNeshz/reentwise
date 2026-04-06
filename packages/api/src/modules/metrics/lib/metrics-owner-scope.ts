import { eq, or, properties, tenants } from "@reentwise/database";

export function ownerPaymentScope(ownerId: string) {
  return or(eq(tenants.ownerId, ownerId), eq(properties.ownerId, ownerId));
}
