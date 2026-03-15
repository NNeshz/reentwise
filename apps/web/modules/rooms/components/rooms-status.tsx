"use client";

import { ROOM_STATUS_VALUES, type RoomStatus } from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import { getBadgeStatus } from "../utils/get-badge-status";
import { useUpdateRoomStatus } from "../hooks/use-rooms";

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
  const badgeStatus = getBadgeStatus(status);

  const handleChange = (value: string) => {
    const typedStatus = value as RoomStatus;
    if (ROOM_STATUS_VALUES.includes(typedStatus)) {
      updateStatus({ roomId, status: typedStatus });
    }
  };

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        className={className}
      >
        <SelectValue>
          <span
            className={
              badgeStatus.variant === "default"
                ? "font-medium"
                : badgeStatus.variant === "destructive"
                  ? "text-destructive font-medium"
                  : ""
            }
          >
            {badgeStatus.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end" sideOffset={2}>
        {ROOM_STATUS_VALUES.map((option) => {
          const optionBadge = getBadgeStatus(option);
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
