"use client";

/**
 * Crear propiedad: React Hook Form + Zod por envío explícito y reglas de
 * validación (longitud, formato). No Zustand: no hay filtros instantáneos.
 */

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
import { useCreateProperty } from "@/modules/properties/hooks/use-properties";
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
  name: z
    .string()
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(50, "El nombre debe tener como máximo 50 caracteres."),
  address: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function PropertiesCreateForm({
  className,
  embedded,
  onSuccess,
}: {
  className?: string;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const createProperty = useCreateProperty();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createProperty.mutateAsync({
      name: values.name,
      address: values.address.trim() || undefined,
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de la propiedad"
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Dirección de la propiedad"
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
                  Incluye la dirección de la propiedad para que puedas
                  encontrarla fácilmente.
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
        disabled={createProperty.isPending}
      >
        {createProperty.isPending ? "Agregando..." : "Agregar propiedad"}
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
        <CardTitle>Agregar propiedad</CardTitle>
        <CardDescription>
          Agrega una nueva propiedad para que puedas gestionarla.
        </CardDescription>
      </CardHeader>
      <CardContent>{formFields}</CardContent>
      <CardFooter>{formActions}</CardFooter>
    </Card>
  );
}
