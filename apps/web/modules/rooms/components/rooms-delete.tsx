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
import { useDeleteRoom } from "@/modules/rooms/hooks/use-rooms";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface RoomsDeleteProps {
  propertyId: string;
  roomId: string;
  onSuccess?: () => void;
}

export function RoomsDelete({ propertyId, roomId, onSuccess }: RoomsDeleteProps) {
  const { mutate: deleteRoom, isPending } = useDeleteRoom(propertyId);

  const handleDelete = async () => {
    try {
      deleteRoom(roomId);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la habitación");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <IconTrash className="size-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de querer eliminar esta habitación?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            <IconTrash className="size-4" />
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
