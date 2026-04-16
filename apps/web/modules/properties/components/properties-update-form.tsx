"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@reentwise/ui/src/components/button"
import { useUpdateProperty } from "@/modules/properties/hooks/use-properties"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@reentwise/ui/src/components/form"
import { Input } from "@reentwise/ui/src/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@reentwise/ui/src/components/input-group"
import { PropertiesDelete } from "@/modules/properties/components/properties-delete"

const ADDRESS_MAX = 100

const formSchema = z.object({
  name: z
    .string()
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
  address: z
    .string()
    .max(ADDRESS_MAX, `La dirección no puede exceder ${ADDRESS_MAX} caracteres.`),
})

type FormValues = z.infer<typeof formSchema>

export function PropertiesUpdateForm({
  propertyId,
  propertyName,
  propertyAddress,
  onSuccess,
}: {
  propertyId: string
  propertyName: string
  propertyAddress: string | null
  onSuccess?: () => void
}) {
  const updateProperty = useUpdateProperty()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: propertyName,
      address: propertyAddress ?? "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    await updateProperty.mutateAsync({
      id: propertyId,
      name: values.name.trim(),
      address: values.address.trim() || undefined,
    })
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4 pb-4 pt-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Casa Av. Juárez" autoComplete="off" {...field} />
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
              <FormLabel>Dirección (opcional)</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupTextarea
                    placeholder="Av. Juárez 123, Col. Centro"
                    rows={3}
                    className="min-h-20 resize-none"
                    {...field}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {(field.value || "").length}/{ADDRESS_MAX}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormDescription>
                Incluye la dirección para encontrarla fácilmente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit" className="w-full" disabled={updateProperty.isPending}>
            {updateProperty.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <PropertiesDelete propertyId={propertyId} />
        </div>
      </form>
    </Form>
  )
}
