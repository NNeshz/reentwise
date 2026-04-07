import { pgEnum } from "drizzle-orm/pg-core";

export const planTierEnum = pgEnum("plan_tier", [
  "freemium",
  "trial",
  "basico",
  "pro",
  "patron",
]);

export const roomsLimitModeEnum = pgEnum("rooms_limit_mode", [
  "total",
  "per_property",
]);

export type PlanTier = (typeof planTierEnum.enumValues)[number];
export type RoomsLimitMode = (typeof roomsLimitModeEnum.enumValues)[number];
