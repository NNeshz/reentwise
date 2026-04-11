"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { RoomsUpdate } from "@/modules/rooms/components/rooms-update";
import { TenantsCreateAndAssign } from "@/modules/tenants/components/tenants-create-and-assign";
import { TenantsAsign } from "@/modules/tenants/components/tenants-asign";
import { useRoom } from "@/modules/rooms/hooks/use-rooms";
import { RoomsDetailSheetError } from "@/modules/rooms/components/rooms-detail-sheet-error";
import { RoomsDetailSheetHeaderSkeleton } from "@/modules/rooms/components/rooms-detail-sheet-header-skeleton";
import { RoomDetailSummaryCard } from "@/modules/rooms/components/room-detail-summary-card";
import { RoomDetailTenantCard } from "@/modules/rooms/components/room-detail-tenant-card";

export function RoomsDetails({
  propertyId,
  roomId,
  children,
  nestedInParentSheet = false,
}: {
  propertyId: string;
  roomId: string;
  children: React.ReactNode;
  /** Si el listado vive dentro del Sheet de propiedad (evita modal anidado roto). */
  nestedInParentSheet?: boolean;
}) {
  const { data: room, isPending, error, refetch, isRefetching } = useRoom(
    propertyId,
    roomId,
  );

  const activeTenant = room?.tenants?.[0];
  const roomPriceNum = room?.price ? Number(room.price) : undefined;
  const tenantCount = room?.tenants?.length ?? 0;
  const canAssignOrCreateTenant = tenantCount === 0;

  return (
    <Sheet modal={!nestedInParentSheet}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        nested={nestedInParentSheet}
        className="flex h-full max-h-dvh w-full flex-col sm:max-w-lg"
      >
        <SheetHeader className="shrink-0">
          {isPending ? (
            <>
              <SheetTitle className="sr-only">Cargando habitación</SheetTitle>
              <RoomsDetailSheetHeaderSkeleton />
            </>
          ) : error ? (
            <>
              <SheetTitle className="sr-only">Error al cargar habitación</SheetTitle>
              <RoomsDetailSheetError
                error={error}
                onRetry={() => void refetch()}
                isRetrying={isRefetching}
              />
            </>
          ) : room ? (
            <div className="flex items-center space-x-4">
              <RoomsUpdate
                nestedInSheet
                propertyId={propertyId}
                roomId={roomId}
                roomNumber={room.roomNumber}
                price={room.price}
                notes={room.notes ?? ""}
              />
              <div>
                <SheetTitle>{room.roomNumber}</SheetTitle>
                <SheetDescription>
                  {tenantCount === 0
                    ? "Crea o asigna un inquilino a esta habitación."
                    : "Detalles de la habitación."}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <div>
              <SheetTitle>Habitación</SheetTitle>
              <SheetDescription>Sin datos.</SheetDescription>
            </div>
          )}
        </SheetHeader>

        {isPending ? (
          <div className="mt-4 shrink-0 px-4">
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        ) : null}

        {!error && room ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col px-4 pt-4">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
                <RoomDetailSummaryCard
                  propertyId={propertyId}
                  roomId={roomId}
                  room={room}
                />
                {activeTenant ? (
                  <RoomDetailTenantCard roomId={roomId} tenant={activeTenant} />
                ) : null}
              </div>
            </div>
            {canAssignOrCreateTenant ? (
              <SheetFooter className="shrink-0">
                <TenantsCreateAndAssign
                  nestedInSheet
                  roomId={roomId}
                  roomPrice={
                    roomPriceNum !== undefined && Number.isFinite(roomPriceNum)
                      ? roomPriceNum
                      : undefined
                  }
                />
                <TenantsAsign nestedInSheet roomId={roomId} />
              </SheetFooter>
            ) : null}
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
