"use client";

import { IconDoor, IconUser, IconUserDollar } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@reentwise/ui/src/components/card";
import { Badge } from "@reentwise/ui/src/components/badge";
import type { RoomListItem } from "@/modules/rooms/types/rooms.types";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  formatRoomPrice,
  getRoomStatusBadge,
  ROOM_PRICE_PERIOD_LABEL,
} from "@/modules/rooms/lib/room-display";

type Props = {
  room: RoomListItem;
  className?: string;
};

export function RoomListCard({ room, className }: Props) {
  const badgeStatus = getRoomStatusBadge(room.status);

  return (
    <Card
      className={cn(
        "pointer-events-none rounded-xl border-border bg-card transition-colors group-hover:border-accent group-hover:bg-accent/20",
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <IconDoor className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base font-semibold">
                {room.roomNumber}
              </CardTitle>
              <CardDescription className="mt-0.5 flex items-center gap-1.5 text-sm">
                <IconUserDollar className="size-3.5" stroke={2} />
                {formatRoomPrice(room.price)}
                <span className="text-muted-foreground/70">
                  {ROOM_PRICE_PERIOD_LABEL}
                </span>
              </CardDescription>
            </div>
          </div>
          <Badge variant={badgeStatus.variant} className="shrink-0">
            <>
              <IconUser className="size-3" stroke={2} />
              {badgeStatus.label}
            </>
          </Badge>
        </div>
      </CardHeader>
      {room.notes ? (
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {room.notes}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
