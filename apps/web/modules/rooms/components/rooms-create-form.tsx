"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateRoom } from "@/modules/rooms/hooks/use-rooms"
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

const NOTES_MAX = 100

const formSchema = z.object({
  roomNumber: z
    .string()
    .min(3, "El identificador debe tener al menos 3 caracteres.")
    .max(50, "El identificador no puede exceder 50 caracteres."),
  price: z
    .string()
    .min(1, "El precio es obligatorio.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
      "Ingresa un precio válido.",
    ),
  notes: z
    .string()
    .max(NOTES_MAX, `Las notas no pueden exceder ${NOTES_MAX} caracteres.`)
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export type RoomsCreateFormHandle = { reset: () => void }

type Props = {
  id: string
  propertyId: string
  onSuccess?: () => void
  onPendingChange?: (isPending: boolean) => void
}

export const RoomsCreateForm = React.forwardRef<RoomsCreateFormHandle, Props>(
  function RoomsCreateForm({ id, propertyId, onSuccess, onPendingChange }, ref) {
    const createRoom = useCreateRoom(propertyId)

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: { roomNumber: "", price: "", notes: "" },
    })

    React.useImperativeHandle(ref, () => ({ reset: () => form.reset() }))

    React.useEffect(() => {
      onPendingChange?.(createRoom.isPending)
    }, [createRoom.isPending, onPendingChange])

    const onSubmit = async (values: FormValues) => {
      await createRoom.mutateAsync({
        roomNumber: values.roomNumber.trim(),
        price: values.price,
        notes: values.notes?.trim() || undefined,
      })
      onSuccess?.()
    }

    return (
      <Form {...form}>
        <form
          id={id}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <FormField
            control={form.control}
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificador</FormLabel>
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
                <FormLabel>Precio mensual</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1000"
                    inputMode="decimal"
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
                <FormLabel>Notas (opcional)</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Descripción de la habitación..."
                      rows={3}
                      className="min-h-20 resize-none"
                      {...field}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {(field.value || "").length}/{NOTES_MAX}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  Añade detalles para distinguirla de las demás.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
)
