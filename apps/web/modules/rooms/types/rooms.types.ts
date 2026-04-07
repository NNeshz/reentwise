/** Valores de `room_status` en base de datos (deben coincidir con el enum). */
export const ROOM_STATUS_VALUES = [
  "vacant",
  "occupied",
  "maintenance",
  "reserved",
] as const;

export type RoomStatus = (typeof ROOM_STATUS_VALUES)[number];

/** Fila de listado (GET /rooms/owner/:propertyId). */
export type RoomListItem = {
  id: string;
  propertyId: string;
  roomNumber: string;
  /** Decimal serializado como string en JSON. */
  price: string;
  notes: string | null;
  status: RoomStatus;
};

export type RoomTenantSummary = {
  id: string;
  name: string;
  whatsapp: string;
  paymentDay: number;
};

/** Detalle con inquilinos (GET /rooms/owner/:propertyId/:id). */
export type RoomDetail = RoomListItem & {
  tenants: RoomTenantSummary[];
};

export type RoomMutationRow = {
  id: string;
  propertyId: string;
  roomNumber: string;
  price: string;
  notes: string | null;
  status: RoomStatus;
};

export type RoomListSortOption =
  | "roomNumber_asc"
  | "price_asc"
  | "price_desc"
  | "status";
