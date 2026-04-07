/** Filtro de estado en listado owner (mes/año). */
export type PaymentStatusFilter = "pending" | "partial" | "paid";

export type PaymentMethod = "cash" | "transfer" | "deposit";

export type PaymentTenantRow = {
  id: string;
  name: string;
  whatsapp: string;
  roomId: string | null;
  paymentDay: number;
};

export type PaymentRoomSummary = {
  roomNumber: string;
};

/** Registro de pago del mes consultado (puede ser null si aún no existe fila). */
export type PaymentMonthRow = {
  id: string;
  amount: string;
  amountPaid: string | null;
  status: string | null;
};

/** Fila del listado GET /payments/owner. */
export type PaymentListRow = {
  tenant: PaymentTenantRow;
  room: PaymentRoomSummary | null;
  payment: PaymentMonthRow | null;
};

/** Fila devuelta por POST pay (tabla payments). */
export type PaymentMutationRow = {
  id: string;
  tenantId: string;
  amount: string;
  amountPaid: string | null;
  status: string | null;
  method: string | null;
  month: number;
  year: number;
};
