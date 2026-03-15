import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@reentwise/ui/src/components/card";
import { IconDoor, IconUser } from "@tabler/icons-react";
import { RoomsUpdate } from "@/modules/rooms/components/rooms-update";
import type { RoomStatus } from "@/modules/rooms/constants";
import { RoomsStatus } from "@/modules/rooms/components/rooms-status";
import { TenantsCreateAndAssign } from "@/modules/tenants/components/tenants-create-and-assign";
import { TenantsAsign } from "@/modules/tenants/components/tenants-asign";
import { useRoom } from "@/modules/rooms/hooks/use-rooms";
import { useUnassignTenant } from "@/modules/tenants/hooks/use-tenants";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@reentwise/ui/src/components/alert-dialog";
import { Button } from "@reentwise/ui/src/components/button";

export function RoomsDetails({
  propertyId,
  roomId,
  children,
}: {
  propertyId: string;
  roomId: string;
  children: React.ReactNode;
}) {
  const { data: rawRoom, isLoading } = useRoom(propertyId, roomId);
  const room = rawRoom && !("message" in rawRoom) ? rawRoom : null;
  const activeTenant = room?.tenants?.[0];

  const { mutate: unassignTenant, isPending: isUnassigning } =
    useUnassignTenant(roomId);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleUnassign = () => {
    if (!activeTenant) return;
    unassignTenant(activeTenant.id, {
      onSuccess: () => {
        setIsAlertOpen(false);
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center space-x-4">
            {room && (
              <RoomsUpdate
                propertyId={propertyId}
                roomId={roomId}
                roomNumber={room.roomNumber}
                price={room.price}
                notes={room.notes || ""}
              />
            )}
            <div>
              <SheetTitle>
                {isLoading ? "Cargando..." : room?.roomNumber}
              </SheetTitle>
              <SheetDescription>Detalles de la habitación.</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="px-4 mt-4 space-y-4">
          <Card className="rounded-xl shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <IconDoor className="size-8 text-primary" stroke={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate">
                    {isLoading ? "..." : room?.roomNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-md mt-1">
                    <span className="font-medium text-primary">
                      {room?.price &&
                        Number(room.price).toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                          minimumFractionDigits: 0,
                        })}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      /mes
                    </span>
                  </CardDescription>
                </div>
                {room?.status && (
                  <RoomsStatus
                    propertyId={propertyId}
                    roomId={roomId}
                    status={room.status as RoomStatus}
                    className="shrink-0 self-center px-3 py-1 text-xs font-medium"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2 text-sm text-muted-foreground">
                {isLoading
                  ? "Cargando..."
                  : room?.notes || "No hay notas para esta habitación."}
              </div>
            </CardContent>
          </Card>

          {activeTenant && (
            <Card className="rounded-xl shadow-md border-primary/20 bg-primary/5">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <IconUser className="size-4" stroke={2} />
                  </span>
                  Inquilino Actual
                </CardTitle>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Desvincular
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Desvincular Inquilino?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción removerá a {activeTenant.name} de la
                        habitación, dejándola disponible (vacant). El inquilino
                        seguirá existiendo en tu base de datos pero sin cuarto
                        asignado.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isUnassigning}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleUnassign();
                        }}
                        disabled={isUnassigning}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        {isUnassigning ? "Desvinculando..." : "Sí, desvincular"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Nombre:</span>{" "}
                    {activeTenant.name}
                  </p>
                  <p>
                    <span className="font-semibold">WhatsApp:</span>{" "}
                    {activeTenant.whatsapp}
                  </p>
                  <p>
                    <span className="font-semibold">Día de pago:</span>{" "}
                    {activeTenant.paymentDay === 0
                      ? "Fin de mes"
                      : activeTenant.paymentDay}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <SheetFooter>
          {room?.tenants && room.tenants.length === 0 && (
            <>
              <TenantsCreateAndAssign roomId={roomId} roomPrice={room?.price ? Number(room.price) : undefined} />
              <TenantsAsign roomId={roomId} />
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
