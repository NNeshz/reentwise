import type {
  PropertyDetail,
  PropertyListItem,
  PropertyMutationRow,
} from "@/modules/properties/types/properties.types";

export function isPropertyListItem(value: unknown): value is PropertyListItem {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    (o.address === null || typeof o.address === "string") &&
    typeof o.totalRooms === "number" &&
    Number.isFinite(o.totalRooms) &&
    typeof o.occupiedRooms === "number" &&
    Number.isFinite(o.occupiedRooms)
  );
}

export function parsePropertiesList(data: unknown): PropertyListItem[] {
  if (!Array.isArray(data)) {
    throw new Error("Se esperaba un listado de propiedades");
  }
  for (const item of data) {
    if (!isPropertyListItem(item)) {
      throw new Error("Formato inválido en una propiedad del listado");
    }
  }
  return data;
}

export function parsePropertyDetail(data: unknown): PropertyDetail {
  if (!isPropertyListItem(data)) {
    throw new Error("Formato inválido de propiedad");
  }
  return data;
}

export function parsePropertyMutationRow(data: unknown): PropertyMutationRow {
  if (data === null || typeof data !== "object") {
    throw new Error("Respuesta inválida al mutar propiedad");
  }
  const o = data as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.name !== "string") {
    throw new Error("Respuesta inválida al mutar propiedad");
  }
  if (o.address !== undefined && o.address !== null && typeof o.address !== "string") {
    throw new Error("Respuesta inválida al mutar propiedad");
  }
  return data as PropertyMutationRow;
}
