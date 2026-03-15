"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
import { useCreateRoom } from "@/modules/rooms/hooks/use-rooms";
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

const formSchema = z.object({
  roomNumber: z
    .string()
    .min(3, "El número de habitación debe tener al menos 3 caracteres.")
    .max(50, "El número de habitación debe tener como máximo 50 caracteres."),
  price: z.string().min(0, "El precio debe ser mayor a 0"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RoomsCreateForm({
  propertyId,
  className,
  embedded,
  onSuccess,
}: {
  propertyId: string;
  className?: string;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const createRoom = useCreateRoom(propertyId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: "",
      price: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createRoom.mutateAsync({
      roomNumber: values.roomNumber,
      price: values.price,
      notes: values.notes,
    });
    form.reset();
    onSuccess?.();
  };

  const formFields = (
    <Form {...form}>
      <form
        id="properties-create-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:px-4"
      >
        <div className={`flex flex-col ${embedded ? "gap-4" : "gap-4"}`}>
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
                  Incluye las notas de la habitación para que puedas distinguirla de las demás.
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
        form="properties-create-form"
        className="w-full"
        disabled={createRoom.isPending}
      >
        {createRoom.isPending ? "Agregando..." : "Agregar habitación"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => form.reset()}
        className="w-full"
      >
        Limpiar
      </Button>
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
        <CardTitle>Agregar habitación</CardTitle>
        <CardDescription>
          Agrega una nueva habitación para que puedas gestionarla.
        </CardDescription>
      </CardHeader>
      <CardContent>{formFields}</CardContent>
      <CardFooter>{formActions}</CardFooter>
    </Card>
  );
}
