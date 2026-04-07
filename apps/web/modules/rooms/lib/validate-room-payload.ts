import {
  ROOM_STATUS_VALUES,
  type RoomDetail,
  type RoomListItem,
  type RoomMutationRow,
  type RoomStatus,
  type RoomTenantSummary,
} from "@/modules/rooms/types/rooms.types";

function isRoomStatus(value: unknown): value is RoomStatus {
  return (
    typeof value === "string" &&
    (ROOM_STATUS_VALUES as readonly string[]).includes(value)
  );
}

function parseRoomCore(value: unknown): Omit<RoomListItem, never> {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de habitación");
  }
  const o = value as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.propertyId !== "string") {
    throw new Error("Formato inválido de habitación");
  }
  if (typeof o.roomNumber !== "string") {
    throw new Error("Formato inválido de habitación");
  }
  if (typeof o.price !== "string" && typeof o.price !== "number") {
    throw new Error("Formato inválido de habitación");
  }
  if (!isRoomStatus(o.status)) {
    throw new Error("Estado de habitación inválido");
  }
  if (
    o.notes !== null &&
    o.notes !== undefined &&
    typeof o.notes !== "string"
  ) {
    throw new Error("Formato inválido de habitación");
  }
  return {
    id: o.id,
    propertyId: o.propertyId,
    roomNumber: o.roomNumber,
    price: String(o.price),
    notes: o.notes === undefined ? null : (o.notes as string | null),
    status: o.status,
  };
}

export function parseRoomsList(data: unknown): RoomListItem[] {
  if (!Array.isArray(data)) {
    throw new Error("Se esperaba un listado de habitaciones");
  }
  return data.map((item) => parseRoomCore(item));
}

function parseTenantSummary(value: unknown): RoomTenantSummary {
  if (value === null || typeof value !== "object") {
    throw new Error("Formato inválido de inquilino");
  }
  const o = value as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.name !== "string" ||
    typeof o.whatsapp !== "string" ||
    typeof o.paymentDay !== "number" ||
    !Number.isFinite(o.paymentDay)
  ) {
    throw new Error("Formato inválido de inquilino");
  }
  return {
    id: o.id,
    name: o.name,
    whatsapp: o.whatsapp,
    paymentDay: o.paymentDay,
  };
}

export function parseRoomDetail(data: unknown): RoomDetail {
  const core = parseRoomCore(data);
  if (data === null || typeof data !== "object" || !("tenants" in data)) {
    throw new Error("Respuesta inválida del detalle de habitación");
  }
  const rawTenants = (data as Record<string, unknown>).tenants;
  if (!Array.isArray(rawTenants)) {
    throw new Error("Lista de inquilinos inválida");
  }
  return {
    ...core,
    tenants: rawTenants.map(parseTenantSummary),
  };
}

export function parseRoomMutationRow(data: unknown): RoomMutationRow {
  const core = parseRoomCore(data);
  return core;
}
