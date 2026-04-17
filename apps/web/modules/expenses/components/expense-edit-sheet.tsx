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

import { useUpdateExpense } from "@/modules/expenses/hooks/use-expenses";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { EXPENSE_CATEGORY_OPTIONS } from "@/modules/expenses/lib/expense-display";
import type {
  ExpenseCategory,
  ExpenseListRow,
} from "@/modules/expenses/types/expenses.types";
import {
  InlineDatePicker,
  isoToDateInput,
  dateInputToIso,
} from "@/utils/inline-date-picker";

const NONE_VALUE = "__none__";

const formSchema = z.object({
  category: z.enum([
    "maintenance",
    "repair",
    "tax",
    "insurance",
    "utility",
    "administration",
    "other",
  ]),
  amount: z
    .string()
    .min(1, "El monto es obligatorio.")
    .refine((v) => Number(v) > 0, "El monto debe ser mayor a 0."),
  description: z.string().max(500).optional(),
  vendor: z.string().max(200).optional(),
  propertyId: z.string().optional(),
  incurredAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ExpenseEditSheet({
  row,
  open,
  onOpenChange,
}: {
  row: ExpenseListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateExpense = useUpdateExpense();
  const { data: properties = [] } = useProperties();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "other",
      amount: "",
      description: "",
      vendor: "",
      propertyId: NONE_VALUE,
      incurredAt: "",
    },
  });

  const { reset } = form;

  React.useEffect(() => {
    if (row && open) {
      reset({
        category: row.expense.category as FormValues["category"],
        amount: row.expense.amount,
        description: row.expense.description ?? "",
        vendor: row.expense.vendor ?? "",
        propertyId: row.expense.propertyId ?? NONE_VALUE,
        incurredAt: isoToDateInput(row.expense.incurredAt),
      });
    }
  }, [row, open, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!row) return;

    await updateExpense.mutateAsync({
      expenseId: row.expense.id,
      category: values.category as ExpenseCategory,
      amount: values.amount,
      description: values.description?.trim() || undefined,
      vendor: values.vendor?.trim() || undefined,
      propertyId:
        values.propertyId && values.propertyId !== NONE_VALUE
          ? values.propertyId
          : undefined,
      incurredAt: values.incurredAt
        ? dateInputToIso(values.incurredAt)
        : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar gasto</SheetTitle>
          <SheetDescription>
            Modifica los datos del gasto seleccionado.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="expense-edit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-5 px-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger ref={field.ref} className="w-full">
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORY_OPTIONS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupTextarea
                        placeholder="Detalles del gasto..."
                        rows={3}
                        className="min-h-20 resize-none"
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
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propiedad (opcional)</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <FormControl>
                      <SelectTrigger ref={field.ref} className="w-full">
                        <SelectValue placeholder="Sin propiedad asignada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>Ninguna</SelectItem>
                      {properties.map((p: { id: string; name: string }) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
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
              name="incurredAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del gasto</FormLabel>
                  <FormControl>
                    <InlineDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecciona la fecha"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="mt-auto gap-2 pt-4">
          <Button
            type="submit"
            form="expense-edit-form"
            className="w-full"
            disabled={updateExpense.isPending}
          >
            {updateExpense.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
