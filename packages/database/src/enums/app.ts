import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "partial",
  "paid",
  "late",
  "annulled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "transfer",
  "deposit",
]);

export const roomStatusEnum = pgEnum("room_status", [
  "vacant",
  "occupied",
  "maintenance",
  "reserved",
]);

/** Canal del evento (correo vs WhatsApp). */
export const auditChannelEnum = pgEnum("audit_channel", ["email", "whatsapp"]);

/**
 * Estado del envío: pendiente → enviando → enviado (o fallo).
 * Valores cortos para filas pequeñas en tablas con muchos registros.
 */
export const auditStatusEnum = pgEnum("audit_status", [
  "pending",
  "sending",
  "sent",
  "failed",
]);

export const contractStatusEnum = pgEnum("contract_status", [
  "draft",
  "active",
  "renewed",
  "terminated",
  "expired",
]);

export const expenseCategoryEnum = pgEnum("expense_category", [
  "maintenance",
  "repair",
  "tax",
  "insurance",
  "utility",
  "administration",
  "other",
]);

export type AuditChannel = (typeof auditChannelEnum.enumValues)[number];
export type AuditStatus = (typeof auditStatusEnum.enumValues)[number];
export type ContractStatus = (typeof contractStatusEnum.enumValues)[number];
export type ExpenseCategory = (typeof expenseCategoryEnum.enumValues)[number];
