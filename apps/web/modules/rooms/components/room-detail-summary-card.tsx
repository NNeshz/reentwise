"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@reentwise/ui/src/components/card";
import { IconDoor } from "@tabler/icons-react";
import type { RoomDetail } from "@/modules/rooms/types/rooms.types";
import { RoomsStatus } from "@/modules/rooms/components/rooms-status";
import {
  formatRoomPrice,
  ROOM_PRICE_PERIOD_LABEL,
} from "@/modules/rooms/lib/room-display";

type Props = {
  propertyId: string;
  roomId: string;
  room: RoomDetail;
};

export function RoomDetailSummaryCard({
  propertyId,
  roomId,
  room,
}: Props) {
  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
            <IconDoor className="size-8 text-primary" stroke={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-lg font-semibold">
              {room.roomNumber}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5 text-base">
              <span className="font-medium text-primary">
                {formatRoomPrice(room.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                {ROOM_PRICE_PERIOD_LABEL}
              </span>
            </CardDescription>
          </div>
          <RoomsStatus
            propertyId={propertyId}
            roomId={roomId}
            status={room.status}
            className="shrink-0 self-center px-3 py-1 text-xs font-medium"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 text-sm text-muted-foreground">
          {room.notes?.trim()
            ? room.notes
            : "No hay notas para esta habitación."}
        </div>
      </CardContent>
    </Card>
  );
}
