"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { IconCalendar } from "@tabler/icons-react"
import { Button } from "@reentwise/ui/src/components/button"
import { Calendar } from "@reentwise/ui/src/components/calendar"
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
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@reentwise/ui/src/components/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@reentwise/ui/src/components/select"
import { Separator } from "@reentwise/ui/src/components/separator"
import { Switch } from "@reentwise/ui/src/components/switch"

export const NOTES_MAX_LENGTH = 500

// Códigos de país (lada): América + Europa
export const COUNTRY_CODES = [
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
] as const

// 0 = Final de mes | 1 = Inicio de mes | 2-31 = Día fijo
export const PAYMENT_DAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Inicio de mes (día 1)" },
  ...Array.from({ length: 27 }, (_, i) => ({
    value: i + 2,
    label: `Día ${i + 2}`,
  })),
  { value: 29, label: "Día 29 (o último en feb.)" },
  { value: 30, label: "Día 30 (o último en feb., abr., jun., sep., nov.)" },
  { value: 31, label: "Día 31 (o último en meses más cortos)" },
  { value: 0, label: "Final de mes" },
]

const formSchema = z.object({
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
  paymentDay: z.number().min(0).max(31),
  notes: z
    .string()
    .max(NOTES_MAX_LENGTH, `Las notas no pueden exceder ${NOTES_MAX_LENGTH} caracteres.`)
    .optional(),
  adjustFirstMonth: z.boolean(),
  firstMonthRent: z.number().min(0, "El monto no puede ser negativo").optional(),
  deposit: z.number().min(0, "El depósito no puede ser negativo").optional(),
  graceDays: z.number().int().min(0).max(30),
  contractStartsAt: z.string().optional(),
  contractEndsAt: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export type CreateAndAssignData = {
  name: string
  email: string
  whatsapp: string
  paymentDay: number
  notes?: string
  firstMonthRent?: number
  deposit?: number
  graceDays?: number
  contractStartsAt?: string
  contractEndsAt?: string
}

/** Parsea YYYY-MM-DD evitando el desplazamiento de zona horaria. */
function parseDateString(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const parts = value.split("-").map(Number)
  const y = parts[0] ?? new Date().getFullYear()
  const m = parts[1] ?? 1
  const d = parts[2] ?? 1
  return new Date(y, m - 1, d)
}

/** Selector de fecha inline: botón que muestra la fecha seleccionada y toggle de calendario. */
function InlineDatePicker({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined
  onChange: (v: string | undefined) => void
  placeholder: string
}) {
  const [open, setOpen] = React.useState(false)
  const selected = parseDateString(value)

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start font-normal"
        onClick={() => setOpen((o) => !o)}
      >
        <IconCalendar className="mr-2 size-4 shrink-0 text-muted-foreground" />
        {selected ? (
          format(selected, "d 'de' MMMM, yyyy", { locale: es })
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </Button>
      {open && (
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(day) => {
            if (day) {
              const y = day.getFullYear()
              const m = String(day.getMonth() + 1).padStart(2, "0")
              const d = String(day.getDate()).padStart(2, "0")
              onChange(`${y}-${m}-${d}`)
            } else {
              onChange(undefined)
            }
            setOpen(false)
          }}
          locale={es}
          className="rounded-md border"
        />
      )}
    </div>
  )
}

export type TenantsCreateAndAssignFormHandle = { reset: () => void }

type TenantsCreateAndAssignFormProps = {
  id: string
  roomPrice?: number
  onSubmit: (data: CreateAndAssignData) => Promise<void>
  isPending: boolean
}

export const TenantsCreateAndAssignForm = React.forwardRef<
  TenantsCreateAndAssignFormHandle,
  TenantsCreateAndAssignFormProps
>(function TenantsCreateAndAssignForm({ id, roomPrice, onSubmit, isPending }, ref) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "52",
      phone: "",
      paymentDay: 1,
      notes: "",
      adjustFirstMonth: false,
      firstMonthRent: undefined,
      deposit: undefined,
      graceDays: 2,
      contractStartsAt: new Date().toISOString().slice(0, 10),
      contractEndsAt: "",
    },
  })

  React.useImperativeHandle(ref, () => ({ reset: () => form.reset() }))

  // Calcula prorrateo del primer mes desde contractStartsAt hasta el primer día de cobro
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      const shouldRecalc =
        value.adjustFirstMonth &&
        (name === "adjustFirstMonth" ||
          name === "paymentDay" ||
          name === "contractStartsAt")

      if (shouldRecalc && roomPrice !== undefined && roomPrice > 0) {
        const startDate = value.contractStartsAt
          ? parseDateString(value.contractStartsAt)
          : new Date()

        if (!startDate) return

        const daysInMonth = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0,
        ).getDate()
        const dailyPrice = roomPrice / daysInMonth
        const payDay = value.paymentDay ?? 1

        // Primer intento: día de cobro en el mismo mes que la fecha de inicio
        let nextPayDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          payDay === 0 ? daysInMonth : Math.min(payDay, daysInMonth),
        )

        // Si el día de cobro ya pasó antes del inicio, mover al mes siguiente
        if (nextPayDate < startDate) {
          const firstOfNextMonth = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            1,
          )
          const daysInNextMonth = new Date(
            firstOfNextMonth.getFullYear(),
            firstOfNextMonth.getMonth() + 1,
            0,
          ).getDate()
          nextPayDate = new Date(
            firstOfNextMonth.getFullYear(),
            firstOfNextMonth.getMonth(),
            payDay === 0 ? daysInNextMonth : Math.min(payDay, daysInNextMonth),
          )
        }

        const diffDays = Math.ceil(
          (nextPayDate.getTime() - startDate.getTime()) / 86_400_000,
        )
        form.setValue(
          "firstMonthRent",
          parseFloat((dailyPrice * diffDays).toFixed(2)),
          { shouldValidate: true, shouldDirty: true },
        )
      } else if (name === "adjustFirstMonth" && !value.adjustFirstMonth) {
        form.setValue("firstMonthRent", undefined)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, roomPrice])

  const handleSubmit = async (values: FormValues) => {
    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      whatsapp: values.countryCode + values.phone.replace(/\D/g, ""),
      paymentDay: values.paymentDay,
      notes: values.notes?.trim() || undefined,
      firstMonthRent:
        values.adjustFirstMonth && values.firstMonthRent !== undefined
          ? values.firstMonthRent
          : undefined,
      deposit: values.deposit ?? undefined,
      graceDays: values.graceDays,
      contractStartsAt: values.contractStartsAt
        ? new Date(values.contractStartsAt).toISOString()
        : undefined,
      contractEndsAt: values.contractEndsAt
        ? new Date(values.contractEndsAt).toISOString()
        : undefined,
    })
    form.reset()
  }

  const watchedStart = form.watch("contractStartsAt")
  const watchedPayDay = form.watch("paymentDay")

  const billingDates = React.useMemo(() => {
    if (!watchedStart) return null
    const startDate = parseDateString(watchedStart)
    if (!startDate) return null
    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1
    const startDay = startDate.getDate()
    const daysInStartMonth = new Date(startYear, startMonth, 0).getDate()
    const effectivePayDay =
      watchedPayDay === 0
        ? daysInStartMonth
        : Math.min(watchedPayDay, daysInStartMonth)

    let firstYear = startYear
    let firstMonth = startMonth
    let firstDay = effectivePayDay

    if (effectivePayDay < startDay) {
      firstMonth = startMonth + 1
      if (firstMonth > 12) {
        firstMonth = 1
        firstYear++
      }
      const daysInNext = new Date(firstYear, firstMonth, 0).getDate()
      firstDay =
        watchedPayDay === 0 ? daysInNext : Math.min(watchedPayDay, daysInNext)
    }

    const firstDate = new Date(firstYear, firstMonth - 1, firstDay)

    // Second billing date: one month after the first
    const secondMonth = firstMonth === 12 ? 1 : firstMonth + 1
    const secondYear = firstMonth === 12 ? firstYear + 1 : firstYear
    const daysInSecondMonth = new Date(secondYear, secondMonth, 0).getDate()
    const secondDay =
      watchedPayDay === 0 ? daysInSecondMonth : Math.min(watchedPayDay, daysInSecondMonth)
    const secondDate = new Date(secondYear, secondMonth - 1, secondDay)

    return {
      first: format(firstDate, "d 'de' MMMM, yyyy", { locale: es }),
      second: format(secondDate, "d 'de' MMMM, yyyy", { locale: es }),
    }
  }, [watchedStart, watchedPayDay])

  const firstBillingLabel = billingDates?.first ?? null

  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 px-4 py-4"
      >
        {/* ── Información del inquilino ── */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">Información del inquilino</p>
          <p className="text-muted-foreground text-xs">
            Datos de contacto que se usarán para enviar avisos y recibos.
          </p>
        </div>

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
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupTextarea
                    placeholder="Información adicional sobre el inquilino..."
                    rows={3}
                    className="min-h-20 resize-none"
                    {...field}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {(field.value || "").length}/{NOTES_MAX_LENGTH}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* ── Contrato ── */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">Contrato</p>
          <p className="text-muted-foreground text-xs">
            Define cuándo inicia el arrendamiento y en qué día del mes se genera
            el cobro mensual. El contrato se crea automáticamente al asignar.
          </p>
        </div>

        <FormField
          control={form.control}
          name="contractStartsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio del contrato</FormLabel>
              <FormControl>
                <InlineDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Selecciona fecha de inicio"
                />
              </FormControl>
              <FormDescription>
                Día en que el inquilino entra a la habitación.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contractEndsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de fin del contrato (opcional)</FormLabel>
              <FormControl>
                <InlineDatePicker
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Sin fecha de fin (indefinido)"
                />
              </FormControl>
              <FormDescription>
                Dejar sin seleccionar para contrato por tiempo indefinido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Día de cobro mensual</FormLabel>
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
              <FormDescription>
                Día del mes en que se genera el cobro cada mes. Días 29–31 y
                &quot;Final de mes&quot; se ajustan en meses más cortos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {firstBillingLabel && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400">
            <span className="font-semibold">Primera fecha de cobro:</span>{" "}
            {firstBillingLabel}
          </div>
        )}

        <FormField
          control={form.control}
          name="adjustFirstMonth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Cobrar fracción del primer periodo
                </FormLabel>
                <p className="text-muted-foreground text-xs">
                  Activa si el inquilino entra a mitad de mes y quieres cobrar
                  solo los días proporcionales antes del primer cobro regular.
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("adjustFirstMonth") && (
          <>
            <FormField
              control={form.control}
              name="firstMonthRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto del primer cobro (fracción)</FormLabel>
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
                          const val = e.target.value
                          field.onChange(val === "" ? undefined : Number(val))
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormDescription>
                    Calculado automáticamente por los días hasta la primera
                    fecha de cobro.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {billingDates && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                <p className="font-semibold mb-1">
                  Se generarán 2 cobros el {billingDates.first}:
                </p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Fracción del primer periodo — monto arriba</li>
                  <li>
                    {roomPrice
                      ? `Primer mes completo — $${roomPrice.toLocaleString("es-MX")}`
                      : "Primer mes completo — renta completa"}
                  </li>
                </ol>
                <p className="mt-1.5 text-amber-700 dark:text-amber-400">
                  A partir de {billingDates.second} se cobran mensualidades regulares.
                </p>
              </div>
            )}
          </>
        )}

        <FormField
          control={form.control}
          name="deposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depósito en garantía (opcional)</FormLabel>
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
                      const val = e.target.value
                      field.onChange(val === "" ? undefined : Number(val))
                    }}
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
                Días después del vencimiento antes de marcar como mora. Por defecto 2.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  )
})
