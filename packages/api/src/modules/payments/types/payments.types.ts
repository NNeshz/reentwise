import type { payments, planLimits } from "@reentwise/database";

export type PaymentStatusFilter = "pending" | "partial" | "paid";

export type PaymentsListApiSuccess<T = unknown> = {
  success: true;
  status: 200;
  message: string;
  data: T;
};

export type PaymentMutationApiSuccess<T = unknown> = {
  success: true;
  status: 200;
  message: string;
  data: T;
};

export type PaymentNotFoundApiError = {
  success: false;
  status: 404;
  message: string;
};

export type PayReceiptMsgRow = {
  tenant: {
    id: string;
    name: string;
    whatsapp: string;
    email: string | null;
  };
  owner: { name: string };
  room: { roomNumber: string };
  property: { name: string | null };
};

export type UpdatedPaymentRow = typeof payments.$inferSelect;

export type PlanLimitsRow = typeof planLimits.$inferSelect;
