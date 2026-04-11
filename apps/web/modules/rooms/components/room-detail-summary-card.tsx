"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@reentwise/ui/src/components/card";
import {
  IconDoor,
  IconNotes,
  IconUser,
  IconUserDollar,
} from "@tabler/icons-react";
import { cn } from "@reentwise/ui/src/lib/utils";
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
  const hasNotes = Boolean(room.notes?.trim());
  const tenantCount = room.tenants.length;

  const tenantSummary =
    tenantCount === 0
      ? "Sin inquilino asignado"
      : tenantCount === 1
        ? "1 inquilino en esta habitación"
        : `${tenantCount} inquilinos en esta habitación`;

  return (
    <Card className="rounded-xl border border-border bg-card">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex flex-wrap items-start gap-4 sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/80 sm:size-12"
              aria-hidden
            >
              <IconDoor
                className="size-5 text-muted-foreground"
                stroke={1.75}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <CardTitle className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                Habitación {room.roomNumber}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <IconUserDollar className="size-3.5 shrink-0" stroke={2} />
                  <span className="sr-only">Renta mensual: </span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatRoomPrice(room.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {ROOM_PRICE_PERIOD_LABEL}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <RoomsStatus
            propertyId={propertyId}
            roomId={roomId}
            status={room.status}
            className="shrink-0 self-center px-3 py-1 text-xs font-medium shadow-none"
          />
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5 text-xs leading-snug text-muted-foreground">
          <IconUser
            className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/90"
            stroke={2}
            aria-hidden
          />
          <span>{tenantSummary}</span>
        </div>
      </CardHeader>

      <CardContent className="border-t border-border px-6 pt-4 pb-5">
        <div className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <IconNotes className="size-3.5 opacity-90" stroke={2} aria-hidden />
          Notas
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed",
            hasNotes
              ? "max-h-40 overflow-y-auto whitespace-pre-wrap pr-1 text-foreground [scrollbar-gutter:stable]"
              : "italic text-muted-foreground",
          )}
        >
          {hasNotes
            ? room.notes!.trim()
            : "Aún no hay notas. Úsalas para recordatorios o detalles del cuarto."}
        </p>
      </CardContent>
    </Card>
  );
}
