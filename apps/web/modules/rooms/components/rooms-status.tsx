"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import {
  ROOM_STATUS_VALUES,
  type RoomStatus,
} from "@/modules/rooms/types/rooms.types";
import { getRoomStatusBadge } from "@/modules/rooms/lib/room-display";
import { useUpdateRoomStatus } from "@/modules/rooms/hooks/use-rooms";

export function RoomsStatus({
  propertyId,
  roomId,
  status,
  className,
}: {
  propertyId: string;
  roomId: string;
  status: RoomStatus;
  className?: string;
}) {
  const { mutate: updateStatus, isPending } = useUpdateRoomStatus(propertyId);
  const badgeStatus = getRoomStatusBadge(status);

  const handleChange = (value: string) => {
    const typedStatus = value as RoomStatus;
    if (ROOM_STATUS_VALUES.includes(typedStatus)) {
      updateStatus({ roomId, status: typedStatus });
    }
  };

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger size="sm" className={className}>
        <SelectValue>
          <span
            className={
              badgeStatus.variant === "default"
                ? "font-medium"
                : badgeStatus.variant === "destructive"
                  ? "font-medium text-destructive"
                  : ""
            }
          >
            {badgeStatus.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="end"
        sideOffset={2}
        className="z-200 shadow-none"
      >
        {ROOM_STATUS_VALUES.map((option) => {
          const optionBadge = getRoomStatusBadge(option);
          return (
            <SelectItem key={option} value={option}>
              {optionBadge.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
