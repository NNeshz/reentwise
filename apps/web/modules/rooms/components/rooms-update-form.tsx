"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
import { useUpdateRoom } from "@/modules/rooms/hooks/use-rooms";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@reentwise/ui/src/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@reentwise/ui/src/components/form";
import { Input } from "@reentwise/ui/src/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@reentwise/ui/src/components/input-group";
import { RoomsDelete } from "@/modules/rooms/components/rooms-delete";

const formSchema = z.object({
  roomNumber: z
    .string()
    .min(3, "El número de habitación debe tener al menos 3 caracteres.")
    .max(50, "El número de habitación debe tener como máximo 50 caracteres."),
  price: z.string().min(1, "El precio es requerido."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RoomsUpdateForm({
  propertyId,
  roomId,
  roomNumber,
  price,
  notes,
  className,
  embedded,
  onSuccess,
}: {
  propertyId: string;
  roomId: string;
  roomNumber: string;
  price: string | number | null;
  notes: string | null;
  className?: string;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const updateRoom = useUpdateRoom(propertyId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber,
      price: price != null ? String(price) : "",
      notes: notes ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateRoom.mutateAsync({
      roomId,
      roomNumber: values.roomNumber,
      price: values.price,
      notes: values.notes,
    });
    onSuccess?.();
  };

  const formFields = (
    <Form {...form}>
      <form
        id="rooms-update-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:px-4"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de habitación</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Habitación A-101"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1000"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Notas de la habitación"
                      rows={embedded ? 3 : 6}
                      className="min-h-24 resize-none"
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value || "").length}/100 caracteres
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  Incluye las notas de la habitación para que puedas
                  distinguirla de las demás.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  const formActions = (
    <div
      className={`flex flex-col gap-2 w-full md:px-4 ${embedded ? "mt-6" : ""}`}
    >
      <Button
        type="submit"
        form="rooms-update-form"
        className="w-full"
        disabled={updateRoom.isPending}
      >
        {updateRoom.isPending ? "Actualizando..." : "Actualizar habitación"}
      </Button>
      <RoomsDelete propertyId={propertyId} roomId={roomId} onSuccess={onSuccess} />
    </div>
  );

  if (embedded) {
    return (
      <div className={className}>
        <div className="py-4">
          {formFields}
          {formActions}
        </div>
      </div>
    );
  }

  return (
    <Card className={`w-full sm:max-w-md ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>Editar habitación</CardTitle>
        <CardDescription>
          Edita la habitación para que puedas gestionarla.
        </CardDescription>
      </CardHeader>
      <CardContent>{formFields}</CardContent>
      <CardFooter>{formActions}</CardFooter>
    </Card>
  );
}
