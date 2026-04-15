/** TanStack Query keys — single source of truth for cross-module invalidation. */
export const queryKeys = {
  tenants: {
    all: ["tenants"] as const,
  },
  properties: {
    all: ["properties"] as const,
    detail: (id: string) => ["properties", id] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    list: (propertyId: string) => ["rooms", propertyId] as const,
    detail: (propertyId: string, roomId: string) =>
      ["rooms", propertyId, roomId] as const,
  },
  payments: {
    all: ["payments"] as const,
  },
  contracts: {
    all: ["contracts"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
  },
  settings: {
    ownerProfile: ["settings", "ownerProfile"] as const,
  },
} as const;
