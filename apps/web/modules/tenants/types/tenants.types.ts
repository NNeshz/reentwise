/** Filtro de estado del pago del mes actual (listado owner). */
export type TenantPaymentFilterStatus =
  | "pending"
  | "partial"
  | "paid"
  | "late"
  | "annulled";

export type TenantRoomSummary = {
  id: string;
  roomNumber: string;
};

/** Fila del listado paginado GET /tenants/owner. */
export type TenantListRow = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  paymentDay: number;
  roomId: string | null;
  room: TenantRoomSummary | null;
  notes?: string | null;
};

export type TenantsListPagination = {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type TenantsListResponse = {
  tenants: TenantListRow[];
  count: number;
  pagination: TenantsListPagination;
};

export type TenantPaymentRecord = {
  id: string;
  tenantId: string;
  amount: string;
  amountPaid: string | null;
  method: string | null;
  status: string | null;
  month: number;
  year: number;
  paidAt: string | null;
  isAnnulled: boolean | null;
  createdAt?: string | Date | null;
};

export type TenantPaymentsResponse = {
  payments: TenantPaymentRecord[];
};

/** Mínimo para filas devueltas por GET room tenants (sin join de cuarto). */
export type TenantCore = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  paymentDay: number;
  roomId: string | null;
};

export type RoomTenantsResponse = {
  tenantsFound: TenantCore[];
};

export type AccountStatusItem = {
  tenantId: string;
  tenantName: string;
  tenantWhatsapp: string;
  roomId: string | null;
  roomNumber: string | null;
  paymentId: string | null;
  amount: number | null;
  amountPaid: number;
  status: string;
};

export type AccountStatusResponse = {
  items: AccountStatusItem[];
};
