"use client";

import { IconDoor, IconUserDollar, IconUser } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@reentwise/ui/src/components/card";
import { Badge } from "@reentwise/ui/src/components/badge";
import { ScrollArea } from "@reentwise/ui/src/components/scroll-area";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@reentwise/ui/src/components/empty";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { useRooms } from "@/modules/rooms/hooks/use-rooms";
import { RoomsDetails } from "@/modules/rooms/components/rooms-details";
import type { RoomStatus } from "@/modules/rooms/constants";
import { getBadgeStatus } from "@/modules/rooms/utils/get-badge-status";

function formatPrice(value: string | number | null | undefined): string {
  if (value == null) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function RoomsList({ propertyId }: { propertyId: string }) {
  const { data: rooms, isLoading, error } = useRooms(propertyId);

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-xl border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Error: {error.message}
      </div>
    );
  }

  const roomsList = Array.isArray(rooms) ? rooms : [];

  if (roomsList.length === 0) {
    return (
      <div className="mt-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconDoor className="size-6" stroke={1.5} />
            </EmptyMedia>
            <EmptyTitle>Sin habitaciones</EmptyTitle>
            <EmptyDescription>
              Agrega la primera habitación con el botón de abajo.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full min-h-0 pr-2">
      <div className="mt-4 space-y-3">
        {roomsList.map((room) => {
          const badgeStatus = getBadgeStatus(room.status as RoomStatus);
          return (
            <RoomsDetails
              key={room.id}
              propertyId={propertyId}
              roomId={room.id}
            >
              <Card
                key={room.id}
                className="rounded-xl border-border bg-card transition-colors hover:border-accent hover:bg-accent/20"
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
                          {formatPrice(room.price)}
                          <span className="text-muted-foreground/70">/mes</span>
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
                {room.notes && (
                  <CardContent className="pt-0">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {room.notes}
                    </p>
                  </CardContent>
                )}
              </Card>
            </RoomsDetails>
          );
        })}
      </div>
    </ScrollArea>
  );
}
