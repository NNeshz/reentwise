"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@reentwise/ui/src/components/sheet";
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
  InputGroupInput,
  InputGroupTextarea,
} from "@reentwise/ui/src/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";

import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import { useUpdateContract } from "@/modules/contracts/hooks/use-contracts";
import { PAYMENT_DAY_OPTIONS } from "@/modules/contracts/lib/contract-display";

const formSchema = z.object({
  rentAmount: z
    .string()
    .min(1, "La renta es obligatoria.")
    .refine((v) => Number(v) > 0, "La renta debe ser mayor a 0."),
  paymentDay: z
    .number()
    .min(0, "Selecciona el día de pago.")
    .max(31),
  deposit: z
    .string()
    .refine((v) => v === "" || Number(v) >= 0, "El depósito no puede ser negativo.")
    .optional(),
  graceDays: z.number().int().min(0).max(30),
  endsAt: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export function ContractEditSheet({
  row,
  open,
  onOpenChange,
}: {
  row: ContractListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateContract = useUpdateContract();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rentAmount: "",
      paymentDay: 1,
      deposit: "",
      graceDays: 2,
      endsAt: "",
      notes: "",
    },
  });

  const { reset } = form;

  React.useEffect(() => {
    if (row && open) {
      reset({
        rentAmount: row.contract.rentAmount,
        paymentDay: row.contract.paymentDay,
        deposit: row.contract.deposit ?? "",
        graceDays: row.contract.graceDays ?? 2,
        endsAt: toDateInput(row.contract.endsAt),
        notes: row.contract.notes ?? "",
      });
    }
  }, [row, open, reset]);

  if (!row) return null;

  const onSubmit = async (values: FormValues) => {
    await updateContract.mutateAsync({
      contractId: row.contract.id,
      rentAmount: values.rentAmount,
      paymentDay: values.paymentDay,
      deposit: values.deposit?.trim() || "0.00",
      graceDays: values.graceDays,
      endsAt: values.endsAt
        ? new Date(values.endsAt).toISOString()
        : null,
      notes: values.notes?.trim() || null,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar contrato</SheetTitle>
          <SheetDescription>
            {row.tenant.name} · Hab. {row.room.roomNumber} · {row.property.name}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="contract-edit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-5 px-4 pt-2"
          >
            <FormField
              control={form.control}
              name="rentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renta mensual</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        placeholder="0.00"
                        className="tabular-nums"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Día de pago</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger ref={field.ref} className="w-full">
                        <SelectValue placeholder="Selecciona el día" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_DAY_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={String(value)}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depósito (opcional)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        placeholder="0.00"
                        className="tabular-nums"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graceDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días de gracia para pago</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      min={0}
                      max={30}
                      className="tabular-nums"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Días después del vencimiento antes de marcar como mora.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endsAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento (opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                        placeholder="Cláusulas especiales, observaciones…"
                        rows={3}
                        className="min-h-20 resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex-row gap-2 sm:justify-stretch">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updateContract.isPending}
              >
                {updateContract.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
