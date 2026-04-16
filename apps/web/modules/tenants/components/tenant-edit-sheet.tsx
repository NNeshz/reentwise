"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@reentwise/ui/src/components/sheet";
import type { TenantListRow } from "@/modules/tenants/types/tenants.types";
import { useUpdateTenant } from "@/modules/tenants/hooks/use-tenants";
import {
  COUNTRY_CODES,
  NOTES_MAX_LENGTH,
  PAYMENT_DAY_OPTIONS,
} from "@/modules/tenants/components/tenants-create-and-assign-form";

function defaultPhoneParts(whatsapp: string): { countryCode: string; phone: string } {
  const digits = whatsapp.replace(/\D/g, "");
  const sorted = [...COUNTRY_CODES].sort(
    (a, b) => b.code.length - a.code.length,
  );
  for (const { code } of sorted) {
    if (digits.startsWith(code) && digits.length > code.length) {
      return { countryCode: code, phone: digits.slice(code.length) };
    }
  }
  return { countryCode: "52", phone: digits.slice(-10) };
}

const editFormSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede exceder 100 caracteres."),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Ingresa un correo electrónico válido."),
  countryCode: z.string().min(1, "Selecciona el código de país."),
  phone: z
    .string()
    .length(10, "El celular debe tener exactamente 10 dígitos.")
    .regex(/^\d+$/, "Solo ingresa números, sin espacios ni símbolos."),
  paymentDay: z
    .number()
    .min(0, "Selecciona el día de pago.")
    .max(31, "El día debe ser entre 0 y 31."),
  notes: z
    .string()
    .max(
      NOTES_MAX_LENGTH,
      `Las notas no pueden exceder ${NOTES_MAX_LENGTH} caracteres.`,
    )
    .optional(),
});

type EditFormValues = z.infer<typeof editFormSchema>;

export function TenantEditSheet({
  tenant,
  open,
  onOpenChange,
}: {
  tenant: TenantListRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateTenant = useUpdateTenant();
  const { countryCode: defaultCode, phone: defaultPhone } = tenant
    ? defaultPhoneParts(tenant.whatsapp)
    : { countryCode: "52", phone: "" };

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: tenant?.name ?? "",
      email: tenant?.email ?? "",
      countryCode: defaultCode,
      phone:
        defaultPhone.length === 10
          ? defaultPhone
          : defaultPhone.replace(/\D/g, "").slice(0, 10),
      paymentDay: tenant?.paymentDay ?? 1,
      notes: tenant?.notes ?? "",
    },
  });

  React.useEffect(() => {
    if (!tenant || !open) return;
    const { countryCode, phone } = defaultPhoneParts(tenant.whatsapp);
    const rawDigits = phone.replace(/\D/g, "");
    const normalizedPhone =
      rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
    form.reset({
      name: tenant.name,
      email: tenant.email,
      countryCode,
      phone: normalizedPhone,
      paymentDay: tenant.paymentDay,
      notes: tenant.notes ?? "",
    });
  }, [tenant, open, form]);

  if (!tenant) return null;

  const onSubmit = async (values: EditFormValues) => {
    const whatsapp = values.countryCode + values.phone.replace(/\D/g, "");
    await updateTenant.mutateAsync({
      tenantId: tenant.id,
      name: values.name.trim(),
      email: values.email.trim(),
      whatsapp,
      paymentDay: values.paymentDay,
      notes: values.notes?.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!block overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar inquilino</SheetTitle>
          <SheetDescription>
            Actualiza los datos de contacto y el día de pago. Los cambios se
            guardan de inmediato.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 px-4 pb-4 pt-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan Pérez García"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="inquilino@correo.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>WhatsApp</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem className="shrink-0">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={field.disabled}
                      >
                        <FormControl>
                          <SelectTrigger ref={field.ref} className="w-full">
                            <SelectValue placeholder="Lada" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRY_CODES.map(({ code, label }) => (
                            <SelectItem key={code} value={code}>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="2221234567"
                          autoComplete="tel-national"
                          inputMode="numeric"
                          maxLength={10}
                          className="tabular-nums"
                          {...field}
                          onChange={(e) => {
                            const digits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            field.onChange(digits);
                          }}
                        />
                      </FormControl>
                      <FormDescription className="sr-only">
                        10 dígitos del celular
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>
                Mismo formato que al dar de alta: lada y 10 dígitos.
              </FormDescription>
            </div>

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
                      <SelectValue placeholder="Selecciona el día del mes" />
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupTextarea
                        placeholder="Información adicional sobre el inquilino…"
                        rows={3}
                        className="min-h-20 resize-none"
                        {...field}
                        value={field.value ?? ""}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value || "").length}/{NOTES_MAX_LENGTH}{" "}
                          caracteres
                        </InputGroupText>
                      </InputGroupAddon>
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
                disabled={updateTenant.isPending}
              >
                {updateTenant.isPending ? "Guardando…" : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
