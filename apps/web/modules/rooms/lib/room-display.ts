import type {
  RoomListItem,
  RoomListSortOption,
  RoomStatus,
} from "@/modules/rooms/types/rooms.types";

/** Contenedor vertical del listado dentro del scroll. */
export const ROOMS_LIST_STACK_CLASS = "mt-4 space-y-3";

const PRICE_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export function formatRoomPrice(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("es-MX", PRICE_FORMAT).format(num);
}

export const ROOM_PRICE_PERIOD_LABEL = "/mes";

export type RoomStatusBadgeConfig = {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
};

export function getRoomStatusBadge(status: RoomStatus): RoomStatusBadgeConfig {
  switch (status) {
    case "occupied":
      return { variant: "default", label: "Ocupado" };
    case "vacant":
      return { variant: "secondary", label: "Disponible" };
    case "reserved":
      return { variant: "outline", label: "Reservado" };
    case "maintenance":
      return { variant: "destructive", label: "En mantenimiento" };
  }
}

export function compareRoomsBySort(
  a: RoomListItem,
  b: RoomListItem,
  sortBy: RoomListSortOption,
): number {
  switch (sortBy) {
    case "roomNumber_asc":
      return a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    case "price_asc": {
      const pa = Number.parseFloat(a.price);
      const pb = Number.parseFloat(b.price);
      const na = Number.isFinite(pa) ? pa : 0;
      const nb = Number.isFinite(pb) ? pb : 0;
      return na - nb;
    }
    case "price_desc": {
      const pa = Number.parseFloat(a.price);
      const pb = Number.parseFloat(b.price);
      const na = Number.isFinite(pa) ? pa : 0;
      const nb = Number.isFinite(pb) ? pb : 0;
      return nb - na;
    }
    case "status": {
      const order: Record<RoomStatus, number> = {
        occupied: 0,
        reserved: 1,
        maintenance: 2,
        vacant: 3,
      };
      const diff = order[a.status] - order[b.status];
      if (diff !== 0) return diff;
      return a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }
    default:
      return 0;
  }
}
