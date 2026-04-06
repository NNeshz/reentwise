import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  decimal,
  pgEnum,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./schema";
import { planTierEnum, roomsLimitModeEnum } from "./plan-enums";

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

export type AuditChannel = (typeof auditChannelEnum.enumValues)[number];
export type AuditStatus = (typeof auditStatusEnum.enumValues)[number];

/** Límites y flags de mensajería por tier (semilla en migración). */
export const planLimits = pgTable("plan_limits", {
  tier: planTierEnum("tier").primaryKey(),
  maxProperties: integer("max_properties").notNull(),
  maxRooms: integer("max_rooms").notNull(),
  roomsLimitMode: roomsLimitModeEnum("rooms_limit_mode").notNull(),
  allowReminderT7: boolean("allow_reminder_t7").notNull(),
  allowReminderT3: boolean("allow_reminder_t3").notNull(),
  allowReminderToday: boolean("allow_reminder_today").notNull(),
  allowEmailPaymentRegistered: boolean("allow_email_payment_registered").notNull(),
  allowWhatsappPaymentReceipt: boolean(
    "allow_whatsapp_payment_receipt",
  ).notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  address: text("address"),
  archivedAt: timestamp("archived_at", {
    mode: "date",
    withTimezone: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id),
  roomNumber: text("room_number").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  status: roomStatusEnum("status").default("vacant"),
  archivedAt: timestamp("archived_at", {
    mode: "date",
    withTimezone: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").references(() => user.id),
  roomId: uuid("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  paymentDay: integer("payment_day").notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }).default("0.00"),
  startDate: timestamp("start_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).default(
    "0.00",
  ),
  method: paymentMethodEnum("method"),
  status: paymentStatusEnum("status").default("pending"),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  paidAt: timestamp("paid_at"),
  receiptUrl: text("receipt_url"),
  isAnnulled: boolean("is_annulled").default(false),
  annulledAt: timestamp("annulled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Registro mínimo de auditoría de envíos (email/WhatsApp).
 * `tenantName` es snapshot para listar sin join; `note` corto (asunto, error, etc.).
 */
export const audits = pgTable("audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id),
  tenantName: varchar("tenant_name", { length: 64 }).notNull(),
  channel: auditChannelEnum("channel").notNull(),
  status: auditStatusEnum("status").notNull(),
  loggedAt: timestamp("logged_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  note: varchar("note", { length: 160 }).notNull(),
});
