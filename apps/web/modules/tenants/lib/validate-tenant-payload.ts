import type {
  AccountStatusItem,
  AccountStatusResponse,
  RoomTenantsResponse,
  TenantCore,
  TenantListRow,
  TenantPaymentRecord,
  TenantPaymentsResponse,
  TenantRoomSummary,
  TenantsListPagination,
  TenantsListResponse,
} from "@/modules/tenants/types/tenants.types";

function parseTenantRoomSummary(value: unknown): TenantRoomSummary | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") return null;
  const r = value as Record<string, unknown>;
  if (r.id == null || r.roomNumber == null) return null;
  if (typeof r.id !== "string" || typeof r.roomNumber !== "string") {
    return null;
  }
  return { id: r.id, roomNumber: r.roomNumber };
}

export function parseTenantCore(value: unknown): TenantCore {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de inquilino");
  }
  const o = value as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.whatsapp !== "string" ||
    typeof o.email !== "string" ||
    typeof o.paymentDay !== "number" ||
    !Number.isFinite(o.paymentDay)
  ) {
    throw new Error("Formato inválido de inquilino");
  }
  const roomId =
    o.roomId === null || o.roomId === undefined
      ? null
      : typeof o.roomId === "string"
        ? o.roomId
        : null;
  return {
    id: o.id,
    name: o.name,
    whatsapp: o.whatsapp,
    email: o.email,
    paymentDay: o.paymentDay,
    roomId,
  };
}

export function parseTenantListRow(value: unknown): TenantListRow {
  const core = parseTenantCore(value);
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de inquilino en listado");
  }
  const o = value as Record<string, unknown>;
  const room = parseTenantRoomSummary(o.room);
  const notes =
    o.notes === null || o.notes === undefined
      ? null
      : typeof o.notes === "string"
        ? o.notes
        : null;
  return { ...core, room, notes };
}

function parsePagination(value: unknown): TenantsListPagination {
  if (value === null || typeof value !== "object") {
    throw new Error("Paginación inválida");
  }
  const p = value as Record<string, unknown>;
  if (
    typeof p.currentPage !== "number" ||
    typeof p.totalPages !== "number" ||
    typeof p.totalProducts !== "number" ||
    typeof p.productsPerPage !== "number" ||
    typeof p.hasNextPage !== "boolean" ||
    typeof p.hasPreviousPage !== "boolean"
  ) {
    throw new Error("Paginación inválida");
  }
  return {
    currentPage: p.currentPage,
    totalPages: p.totalPages,
    totalProducts: p.totalProducts,
    productsPerPage: p.productsPerPage,
    hasNextPage: p.hasNextPage,
    hasPreviousPage: p.hasPreviousPage,
    nextPage:
      p.nextPage === null || typeof p.nextPage === "number"
        ? p.nextPage
        : null,
    previousPage:
      p.previousPage === null || typeof p.previousPage === "number"
        ? p.previousPage
        : null,
  };
}

export function parseTenantsListResponse(data: unknown): TenantsListResponse {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida del listado de inquilinos");
  }
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.tenants)) {
    throw new Error("Respuesta inválida del listado de inquilinos");
  }
  return {
    tenants: o.tenants.map(parseTenantListRow),
    count: typeof o.count === "number" ? o.count : o.tenants.length,
    pagination: parsePagination(o.pagination),
  };
}

export function parseRoomTenantsResponse(data: unknown): RoomTenantsResponse {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida de inquilinos del cuarto");
  }
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.tenantsFound)) {
    throw new Error("Respuesta inválida de inquilinos del cuarto");
  }
  return {
    tenantsFound: o.tenantsFound.map(parseTenantCore),
  };
}

export function parseTenantPaymentRecord(value: unknown): TenantPaymentRecord {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de pago");
  }
  const p = value as Record<string, unknown>;
  if (
    typeof p.id !== "string" ||
    typeof p.tenantId !== "string" ||
    (typeof p.amount !== "string" && typeof p.amount !== "number") ||
    typeof p.month !== "number" ||
    typeof p.year !== "number"
  ) {
    throw new Error("Formato inválido de pago");
  }
  return {
    id: p.id,
    tenantId: p.tenantId,
    amount: String(p.amount),
    amountPaid:
      p.amountPaid === null || p.amountPaid === undefined
        ? null
        : String(p.amountPaid),
    method: typeof p.method === "string" ? p.method : null,
    status: typeof p.status === "string" ? p.status : null,
    month: p.month,
    year: p.year,
    paidAt: typeof p.paidAt === "string" ? p.paidAt : null,
    isAnnulled: typeof p.isAnnulled === "boolean" ? p.isAnnulled : null,
    createdAt: p.createdAt as string | Date | null | undefined,
  };
}

export function parseTenantPaymentsResponse(
  data: unknown,
): TenantPaymentsResponse {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida de pagos");
  }
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.payments)) {
    throw new Error("Respuesta inválida de pagos");
  }
  return { payments: o.payments.map(parseTenantPaymentRecord) };
}

function parseAccountStatusItem(value: unknown): AccountStatusItem {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido en estado de cuenta");
  }
  const i = value as Record<string, unknown>;
  if (
    typeof i.tenantId !== "string" ||
    typeof i.tenantName !== "string" ||
    typeof i.tenantWhatsapp !== "string" ||
    typeof i.amountPaid !== "number" ||
    typeof i.status !== "string"
  ) {
    throw new Error("Formato inválido en estado de cuenta");
  }
  return {
    tenantId: i.tenantId,
    tenantName: i.tenantName,
    tenantWhatsapp: i.tenantWhatsapp,
    roomId:
      i.roomId === null || typeof i.roomId === "string" ? i.roomId : null,
    roomNumber:
      i.roomNumber === null || typeof i.roomNumber === "string"
        ? i.roomNumber
        : null,
    paymentId:
      i.paymentId === null || typeof i.paymentId === "string"
        ? i.paymentId
        : null,
    amount:
      i.amount === null || typeof i.amount === "number" ? i.amount : null,
    amountPaid: i.amountPaid,
    status: i.status,
  };
}

export function parseAccountStatusResponse(
  data: unknown,
): AccountStatusResponse {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida de estado de cuenta");
  }
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.items)) {
    throw new Error("Respuesta inválida de estado de cuenta");
  }
  return { items: o.items.map(parseAccountStatusItem) };
}
