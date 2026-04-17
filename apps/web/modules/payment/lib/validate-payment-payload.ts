import type {
  PaymentListRow,
  PaymentMethod,
  PaymentMonthRow,
  PaymentMutationRow,
  PaymentRoomSummary,
  PaymentTenantRow,
  PaymentsListPagination,
  PaymentsListResponse,
} from "@/modules/payment/types/payment.types";

function parsePaymentTenant(value: unknown): PaymentTenantRow {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de inquilino en listado de pagos");
  }
  const t = value as Record<string, unknown>;
  if (
    typeof t.id !== "string" ||
    typeof t.name !== "string" ||
    typeof t.whatsapp !== "string" ||
    typeof t.paymentDay !== "number" ||
    !Number.isFinite(t.paymentDay)
  ) {
    throw new Error("Formato inválido de inquilino en listado de pagos");
  }
  const roomId =
    t.roomId === null || t.roomId === undefined
      ? null
      : typeof t.roomId === "string"
        ? t.roomId
        : null;
  return {
    id: t.id,
    name: t.name,
    whatsapp: t.whatsapp,
    roomId,
    paymentDay: t.paymentDay,
  };
}

function parsePaymentRoom(value: unknown): PaymentRoomSummary | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") return null;
  const r = value as Record<string, unknown>;
  if (typeof r.roomNumber !== "string") return null;
  return { roomNumber: r.roomNumber };
}

function parsePaymentMonth(value: unknown): PaymentMonthRow | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") {
    throw new Error("Formato inválido de pago en listado");
  }
  const p = value as Record<string, unknown>;
  if (typeof p.id !== "string") {
    throw new Error("Formato inválido de pago en listado");
  }
  if (typeof p.amount !== "string" && typeof p.amount !== "number") {
    throw new Error("Formato inválido de pago en listado");
  }
  return {
    id: p.id,
    amount: String(p.amount),
    amountPaid:
      p.amountPaid === null || p.amountPaid === undefined
        ? null
        : String(p.amountPaid),
    status: typeof p.status === "string" ? p.status : null,
  };
}

export function parsePaymentListRow(value: unknown): PaymentListRow {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido en fila de pagos");
  }
  const o = value as Record<string, unknown>;
  return {
    tenant: parsePaymentTenant(o.tenant),
    room: parsePaymentRoom(o.room),
    payment: parsePaymentMonth(o.payment),
  };
}

function parsePagination(value: unknown): PaymentsListPagination {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de paginación");
  }
  const p = value as Record<string, unknown>;
  return {
    currentPage: typeof p.currentPage === "number" ? p.currentPage : 1,
    totalPages: typeof p.totalPages === "number" ? p.totalPages : 0,
    totalItems: typeof p.totalItems === "number" ? p.totalItems : 0,
    itemsPerPage: typeof p.itemsPerPage === "number" ? p.itemsPerPage : 50,
    hasNextPage: typeof p.hasNextPage === "boolean" ? p.hasNextPage : false,
    hasPreviousPage: typeof p.hasPreviousPage === "boolean" ? p.hasPreviousPage : false,
    nextPage: typeof p.nextPage === "number" ? p.nextPage : null,
    previousPage: typeof p.previousPage === "number" ? p.previousPage : null,
  };
}

export function parsePaymentsList(data: unknown): PaymentListRow[] {
  if (!Array.isArray(data)) {
    throw new Error("Se esperaba un listado de pagos");
  }
  return data.map(parsePaymentListRow);
}

export function parsePaymentsListResponse(data: unknown): PaymentsListResponse {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida de pagos");
  }
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.payments)) {
    throw new Error("Se esperaba un listado de pagos");
  }
  return {
    payments: o.payments.map(parsePaymentListRow),
    pagination: parsePagination(o.pagination),
  };
}

const PAYMENT_METHODS: readonly PaymentMethod[] = [
  "cash",
  "transfer",
  "deposit",
];

function isPaymentMethod(v: unknown): v is PaymentMethod {
  return typeof v === "string" && PAYMENT_METHODS.includes(v as PaymentMethod);
}

export function parsePaymentMutationRow(data: unknown): PaymentMutationRow {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida al registrar pago");
  }
  const p = data as Record<string, unknown>;
  if (
    typeof p.id !== "string" ||
    typeof p.tenantId !== "string" ||
    (typeof p.amount !== "string" && typeof p.amount !== "number") ||
    typeof p.month !== "number" ||
    typeof p.year !== "number"
  ) {
    throw new Error("Respuesta inválida al registrar pago");
  }
  const method = p.method;
  return {
    id: p.id,
    tenantId: p.tenantId,
    amount: String(p.amount),
    amountPaid:
      p.amountPaid === null || p.amountPaid === undefined
        ? null
        : String(p.amountPaid),
    status: typeof p.status === "string" ? p.status : null,
    method: isPaymentMethod(method) ? method : null,
    month: p.month,
    year: p.year,
  };
}
