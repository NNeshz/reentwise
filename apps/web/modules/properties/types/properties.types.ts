/** Fila de listado con agregados de cuartos (respuesta de GET /properties/owner). */
export type PropertyListItem = {
  id: string;
  name: string;
  address: string | null;
  totalRooms: number;
  occupiedRooms: number;
  /** ISO 8601; solo en detalle o con `includeArchived` en listado. */
  archivedAt?: string | null;
};

/** Detalle de una propiedad (GET /properties/owner/:id). */
export type PropertyDetail = PropertyListItem;

/**
 * Fila devuelta por create/update/delete (tabla `properties`).
 * El cliente solo valida campos mínimos; el servidor puede incluir más columnas.
 */
export type PropertyMutationRow = {
  id: string;
  name: string;
  address: string | null;
  ownerId?: string;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  archivedAt?: Date | string | null;
};

export type PropertySortOption = "name_asc" | "occupancy_desc";
