import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  decimal,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./schema";

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

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  address: text("address"),
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").references(() => user.id),
  roomId: uuid("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
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
