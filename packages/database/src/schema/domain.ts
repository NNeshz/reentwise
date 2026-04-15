import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  decimal,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { planTierEnum, roomsLimitModeEnum } from "../enums/plan-tier";
import {
  paymentStatusEnum,
  paymentMethodEnum,
  roomStatusEnum,
  contractStatusEnum,
  expenseCategoryEnum,
  auditChannelEnum,
  auditStatusEnum,
} from "../enums/app";

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

/**
 * Contrato / arrendamiento: acuerdo acotado en el tiempo entre dueño e inquilino.
 * Cada renovación es una fila nueva; la anterior queda en `renewed` o `terminated`.
 */
export const contracts = pgTable("contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id),
  status: contractStatusEnum("status").notNull().default("draft"),
  rentAmount: decimal("rent_amount", { precision: 10, scale: 2 }).notNull(),
  paymentDay: integer("payment_day").notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }).default("0.00"),
  startsAt: timestamp("starts_at", { mode: "date", withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { mode: "date", withTimezone: true }),
  signedAt: timestamp("signed_at", { mode: "date", withTimezone: true }),
  terminatedAt: timestamp("terminated_at", { mode: "date", withTimezone: true }),
  /** FK al contrato anterior cuando es renovación. */
  previousContractId: uuid("previous_contract_id"),
  pdfUrl: text("pdf_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id),
  /** Nullable para compatibilidad con cobros pre-contratos; nuevos cobros deben llenarlo. */
  contractId: uuid("contract_id").references(() => contracts.id),
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

/** Gastos del dueño (mantenimiento, impuestos, seguros, etc.). */
export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  propertyId: uuid("property_id").references(() => properties.id),
  roomId: uuid("room_id").references(() => rooms.id),
  category: expenseCategoryEnum("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  vendor: text("vendor"),
  receiptUrl: text("receipt_url"),
  incurredAt: timestamp("incurred_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
