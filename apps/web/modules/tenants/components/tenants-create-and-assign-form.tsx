"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@reentwise/ui/src/components/button";
import { useCreateAndAssignTenant } from "@/modules/tenants/hooks/use-tenants";
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
import { Separator } from "@reentwise/ui/src/components/separator";
import { Switch } from "@reentwise/ui/src/components/switch";

const NOTES_MAX_LENGTH = 500;

// Códigos de país (lada): América + Europa
const COUNTRY_CODES = [
  { code: "1", label: "+1 🇺🇸 / 🇨🇦" },
  { code: "52", label: "+52 🇲🇽" },
  { code: "53", label: "+53 🇨🇺" },
  { code: "54", label: "+54 🇦🇷" },
  { code: "55", label: "+55 🇧🇷" },
  { code: "56", label: "+56 🇨🇱" },
  { code: "57", label: "+57 🇨🇴" },
  { code: "58", label: "+58 🇻🇪" },
  { code: "591", label: "+591 🇧🇴" },
  { code: "592", label: "+592 🇬🇾" },
  { code: "593", label: "+593 🇪🇨" },
  { code: "594", label: "+594 🇬🇫" },
  { code: "595", label: "+595 🇵🇦" },
  { code: "598", label: "+598 🇺🇾" },
  { code: "501", label: "+501 🇧🇿" },
  { code: "502", label: "+502 🇬🇹" },
  { code: "503", label: "+503 🇸🇻" },
  { code: "504", label: "+504 🇭🇳" },
  { code: "505", label: "+505 🇳🇮" },
  { code: "506", label: "+506 🇨🇷" },
  { code: "507", label: "+507 🇵🇦" },
  { code: "508", label: "+508 🇵🇲" },
  { code: "509", label: "+509 🇭🇹" },
  { code: "511", label: "+511 🇵🇪" },
  { code: "30", label: "+30 🇬🇷" },
  { code: "31", label: "+31 🇳🇱" },
  { code: "32", label: "+32 🇧🇪" },
  { code: "33", label: "+33 🇫🇷" },
  { code: "34", label: "+34 🇪🇸" },
  { code: "36", label: "+36 🇭🇺" },
  { code: "39", label: "+39 🇮🇹" },
  { code: "40", label: "+40 🇷🇴" },
  { code: "41", label: "+41 🇨🇭" },
  { code: "43", label: "+43 🇦🇹" },
  { code: "44", label: "+44 🇬🇧" },
  { code: "45", label: "+45 🇩🇰" },
  { code: "46", label: "+46 🇸🇪" },
  { code: "47", label: "+47 🇳🇴" },
  { code: "48", label: "+48 🇵🇱" },
  { code: "49", label: "+49 🇩🇪" },
  { code: "351", label: "+351 🇵🇹" },
  { code: "352", label: "+352 🇱🇺" },
  { code: "353", label: "+353 🇮🇪" },
  { code: "358", label: "+358 🇫🇮" },
  { code: "380", label: "+380 🇺🇦" },
  { code: "420", label: "+420 🇨🇿" },
] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede exceder 100 caracteres."),
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
  adjustFirstMonth: z.boolean(),
  firstMonthRent: z
    .number()
    .min(0, "El monto no puede ser negativo")
    .optional(),
  deposit: z.number().min(0, "El depósito no puede ser negativo").optional(),
});

type FormValues = z.infer<typeof formSchema>;

// 0 = Final de mes | 1 = Inicio de mes | 2-31 = Día fijo (29-31 usan último día en meses cortos)
const PAYMENT_DAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Inicio de mes (día 1)" },
  ...Array.from({ length: 27 }, (_, i) => ({
    value: i + 2,
    label: `Día ${i + 2}`,
  })),
  { value: 29, label: "Día 29 (o último en feb.)" },
  { value: 30, label: "Día 30 (o último en feb., abr., jun., sep., nov.)" },
  { value: 31, label: "Día 31 (o último en meses más cortos)" },
  { value: 0, label: "Final de mes" },
];

export function TenantsCreateAndAssignForm({
  roomId,
  roomPrice,
  className,
  embedded,
  onSuccess,
}: {
  roomId: string;
  roomPrice?: number;
  className?: string;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const createAndAssignTenant = useCreateAndAssignTenant(roomId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      countryCode: "52",
      phone: "",
      paymentDay: 1,
      notes: "",
      adjustFirstMonth: false,
      firstMonthRent: undefined,
      deposit: undefined,
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Si el usuario activa la opción de fracción (o cambia el día de pago mientras está activa)
      if (
        (name === "adjustFirstMonth" && value.adjustFirstMonth) ||
        (name === "paymentDay" && value.adjustFirstMonth)
      ) {
        if (roomPrice !== undefined && roomPrice > 0) {
          const today = new Date();
          const currentYear = today.getFullYear();
          const currentMonth = today.getMonth();
          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          
          const dailyPrice = roomPrice / daysInMonth;
          const userPaymentDay = value.paymentDay ?? 1;
          
          let nextPaymentDate = new Date(currentYear, currentMonth, userPaymentDay === 0 ? daysInMonth : userPaymentDay);
          
          if (nextPaymentDate <= today) {
            const nextMonth = currentMonth + 1;
            const daysInNextMonth = new Date(currentYear, nextMonth + 1, 0).getDate();
            const nextPDay = userPaymentDay === 0 ? daysInNextMonth : Math.min(userPaymentDay, daysInNextMonth);
            nextPaymentDate = new Date(currentYear, nextMonth, nextPDay);
          }
          
          const diffTime = nextPaymentDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          const prorated = parseFloat((dailyPrice * diffDays).toFixed(2));
          form.setValue("firstMonthRent", prorated, { shouldValidate: true, shouldDirty: true });
        }
      } else if (name === "adjustFirstMonth" && !value.adjustFirstMonth) {
        // Limpiamos el valor si destilda la opción
        form.setValue("firstMonthRent", undefined);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, roomPrice]);

  const onSubmit = async (values: FormValues) => {
    const whatsapp = values.countryCode + values.phone.replace(/\D/g, "");
    await createAndAssignTenant.mutateAsync({
      name: values.name.trim(),
      whatsapp,
      paymentDay: values.paymentDay,
      notes: values.notes?.trim() || undefined,
      firstMonthRent:
        values.adjustFirstMonth && values.firstMonthRent !== undefined
          ? values.firstMonthRent
          : undefined,
      deposit: values.deposit !== undefined ? values.deposit : undefined,
    });
    form.reset();
    onSuccess?.();
  };

  const formFields = (
    <Form {...form}>
      <form
        id="tenants-create-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:px-4"
      >
        <div className={`flex flex-col ${embedded ? "gap-4" : "gap-5"}`}>
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

          <div className="space-y-2">
            <FormLabel>WhatsApp</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem className="shrink-0">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={field.disabled}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Lada" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map(({ code, label }) => (
                            <SelectItem key={code} value={code}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-0">
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
              Selecciona el código de país y los 10 dígitos del celular.
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
                    <SelectTrigger className="w-full">
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
                <FormDescription>
                  Día del mes en que el inquilino realiza el pago. Días 29-31 y
                  &quot;Final de mes&quot; se ajustan en febrero y meses de 30
                  días.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adjustFirstMonth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Cobrar una fracción del primer mes
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("adjustFirstMonth") && (
            <FormField
              control={form.control}
              name="firstMonthRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad a cobrar este primer mes</FormLabel>
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
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormDescription>
                    A partir del mes siguiente se cobrará la renta completa
                    automáticamente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depósito en garantía (Opcional)</FormLabel>
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
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : Number(val));
                      }}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!embedded && <Separator />}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas (opcional)</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      placeholder="Información adicional sobre el inquilino..."
                      rows={embedded ? 3 : 4}
                      className="min-h-20 resize-none"
                      {...field}
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
        form="tenants-create-form"
        className="w-full"
        disabled={createAndAssignTenant.isPending}
      >
        {createAndAssignTenant.isPending ? "Agregando..." : "Agregar inquilino"}
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
        <CardTitle>Agregar inquilino</CardTitle>
        <CardDescription>
          Agrega un nuevo inquilino para que puedas gestionarlo.
        </CardDescription>
      </CardHeader>
      <CardContent>{formFields}</CardContent>
      <CardFooter>{formActions}</CardFooter>
    </Card>
  );
}
