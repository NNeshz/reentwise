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
import { useDeleteProperty } from "@/modules/properties/hooks/use-properties";
import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

interface PropertiesDeleteProps {
  propertyId: string;
}

export function PropertiesDelete({ propertyId }: PropertiesDeleteProps) {
  const { mutate: deleteProperty, isPending } = useDeleteProperty();

  const handleDelete = async () => {
    try {
      await deleteProperty(propertyId);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar la propiedad");
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
            ¿Estás seguro de querer eliminar esta propiedad?
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
