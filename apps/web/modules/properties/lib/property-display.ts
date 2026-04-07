import type { PropertyListItem } from "@/modules/properties/types/properties.types";

/** Grid responsive para tarjetas de propiedades. */
export const PROPERTIES_GRID_CLASS =
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

export function formatPropertyAddress(address: string | null | undefined): string {
  if (address == null || address.trim() === "") return "Sin dirección";
  return address;
}

export function propertyOccupancyPercent(property: PropertyListItem): number {
  const { totalRooms, occupiedRooms } = property;
  if (totalRooms <= 0) return 0;
  return Math.round((occupiedRooms / totalRooms) * 100);
}

export function propertyAvailableRooms(property: PropertyListItem): number {
  return Math.max(property.totalRooms - property.occupiedRooms, 0);
}

export const PROPERTY_ROOMS_LABEL = (n: number) =>
  n === 1 ? "cuarto" : "cuartos";
