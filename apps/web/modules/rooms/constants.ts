/** Room status values - must match room_status enum in database */
export const ROOM_STATUS_VALUES = [
  "vacant",
  "occupied",
  "maintenance",
  "reserved",
] as const;

export type RoomStatus = (typeof ROOM_STATUS_VALUES)[number];
