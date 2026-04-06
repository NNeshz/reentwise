# Reentwise — Plan: Stripe, planes y límites (propiedades / cuartos / mensajería)

Documento de planeación y análisis. **En estudio:** migrar la facturación de **Stripe** a **Polar** (plan en §13). **Estado del código hoy:** modelo de planes en BD (`plan_tier`, `plan_limits`), guards al crear propiedad/cuarto, webhooks Stripe alineados con `plan_tier` y limpieza al borrar suscripción; **Kapso** tipado + `envs` con defaults; **cron** con T-7 / T-3 / día de pago, mora (2 días después del vencimiento), plantillas Kapso, flags de `plan_limits` e idempotencia vía `audits`; **pagos** con WA (abono / completado) y email según `plan_limits` (`allowWhatsappPaymentReceipt`, `allowEmailPaymentRegistered`). **Sigue pendiente de impacto:** gating de **bienvenida** en `tenants.service`, stub de WhatsApp en **anulación** de pago, UI de planes/uso/límites, política “hasta fin de periodo” tras `cancel_at_period_end`, y aplicar la migración en cada entorno.

---

## Checklist — implementación (hecho vs pendiente)

Usa esto como lista de trabajo hasta que el producto coincida con las reglas de las secciones 1 y 8.

### Base de datos

- [x] Enums PostgreSQL `plan_tier` y `rooms_limit_mode` (`packages/database/src/plan-enums.ts`).
- [x] Tabla `plan_limits` con límites + flags de mensajería y seed en migración (`packages/database/src/other.ts`, `drizzle/0003_plan_limits_user_profile.sql`).
- [x] `user`: `plan_tier` (sustituye `plan_type` texto), `subscription_current_period_end`, `stripe_price_id`, `currency`, `timezone`, `locale`, `business_name`, `tax_id`.
- [x] `archived_at` en `properties` y `rooms` (conteo de límites ignora archivados en API).
- [x] Migración `0003_plan_limits_user_profile.sql` registrada en `drizzle/meta/_journal.json`.
- [ ] **Aplicar la migración** en local/staging/producción (`packages/database`: `bun run db:migrate` o ejecutar el SQL si tu flujo difiere).

### API — límites y Stripe

- [x] Servicio `plan-limits.service.ts`: tier efectivo (`subscription_status === trialing` → límites `trial`; activo/past_due → `user.plan_tier`; resto → `freemium`).
- [x] `createProperty` / `createRoom`: rechazo con **402** si se supera cupo (`properties.service`, `rooms.service`).
- [x] Stripe: mapeo `price_id` → `basico` | `pro` | `patron`; persistir `stripe_price_id` y fin de periodo (vía `items.data[0].current_period_end`); `subscription.deleted` → `plan_tier = freemium` y limpieza de campos de suscripción.
- [ ] **Límites “hasta que termine el periodo pagado”** si el usuario cancela con `cancel_at_period_end`: hoy el tier efectivo no usa `subscription_current_period_end` (ver §10.1).
- [ ] Tests de integración para límites de propiedades/cuartos (total vs `per_property`).

### API — mensajería, pagos y cron

- [x] Gating con flags de `plan_limits` en **`cron.service`** y **`payments.service`** (recordatorios T-7/T-3/hoy y mora según `allowReminder*`; WA y email de pago según `allowWhatsappPaymentReceipt` / `allowEmailPaymentRegistered`).
- [ ] Gating en **`tenants.service`** (bienvenida email/WhatsApp) según plan — la bienvenida WA ya usa `kapsoBodyReminderConfirmation` pero **no** consulta límites aún.
- [x] Cron: **T-7, T-3, día de pago** + WhatsApp/email alineados a §1.2 (`kapsoBodyReminder7d` / `kapsoBodyReminder3d` / `kapsoBodyReminderToday` + `kapsoTemplateName`). Mora: **2 días después** del vencimiento con `kapsoBodyExpirationNotice` (ajustable si el producto pide otro desfase).
- [x] Por envío en cron/pagos: **owner** resuelto (join a `user`) y **`getLimitsContext(ownerId)`** antes de mandar.
- [x] Idempotencia en **cron** (`auditsService.hasCronReminderForDate` + prefijos de nota); emails de pago usan `idempotencyKey` en Resend.
- [x] **`payments.service`:** `kapsoBodyAbonoRecived` y `kapsoBodyPaymentCompleted` cuando el plan lo permite.
- [ ] **Anulación de pago:** `annulPayment` aún tiene **stub** de WhatsApp (`console.log`); sustituir por plantilla real o eliminar si no aplica.

### Downgrade y archivado

- [x] Columnas `archived_at` listas en esquema.
- [ ] Endpoints o flujos en API/UI para **archivar** propiedad/cuarto (escribir `archived_at`) y mensajes/banners de “sobre límite” (§10.1).
- [ ] Export “descargar mi data” (opcional, §10.1).

### Frontend

- [ ] Pantalla de planes + CTA checkout; price IDs desde env o API pública.
- [ ] Mostrar uso **X/Y propiedades** y **X/Y cuartos** (según modo total vs por propiedad).
- [ ] Deshabilitar botones de alta cuando se llegue al tope (además del 402 del servidor).
- [ ] Mapeo de etiquetas en UI: `plan_tier` (`basico`, …) → texto visible (“Básico”, …).

### Stripe / operación (checklist §4)

- [ ] Sin cambio respecto al §4: productos/precios en Dashboard, Customer Portal, webhooks extra (`invoice.payment_failed`, etc.), impuestos MX, metadata `plan_tier` en Price.

### Fase 2 / más adelante

- [ ] Tabla `usage_monthly` o agregados desde `audits` si facturas por volumen de mensajes.
- [ ] Monitoreo/alertas si fallan webhooks o sube `audits.status = failed`.

### Facturación — migración Stripe → Polar (plan)

- [ ] **Descubrimiento:** revisar docs Polar (webhooks, suscripciones, checkout, portal de cliente, impuestos / cobertura **México**, trials, cancelaciones).
- [ ] **Spike técnico:** SDK o API HTTP; tabla de equivalencia evento Polar → actualización de `user` (`plan_tier`, periodo actual, estado de suscripción).
- [ ] **Abstracción o reemplazo:** nuevo módulo tipo `polar.service.ts` (o `billing.service.ts` con proveedor inyectable) y retirar dependencia directa de `stripe` en rutas/webhooks.
- [ ] **Modelo de datos:** decidir si renombrar `stripe_customer_id` / `stripe_subscription_id` a nombres neutros (`billing_*`) y migración SQL; periodo de doble escritura opcional.
- [ ] **Entorno:** variables `POLAR_*` (API, webhook secret, IDs de producto/precio o equivalentes); deprecar `STRIPE_*` tras el corte.
- [ ] **Frontend:** enlaces de checkout y flujo “administrar suscripción” apuntando a Polar (hosted checkout / Customer Portal según ofrezca el producto).
- [ ] **Suscripciones existentes en Stripe:** política (migración manual, convivencia hasta fin de periodo, comunicación a usuarios); sin borrar datos en BD por el cambio de PSP.
- [ ] **Webhook Polar:** endpoint dedicado, verificación de firma, idempotencia y logs alineados a lo ya hecho con Stripe.
- [ ] **Costos y contabilidad:** actualizar §5 con comisiones Polar; validar facturación/IVA MX con contador si Polar cambia el flujo respecto a Stripe.

---

## 1. Matriz de producto (planes aprobados)

| Plan | Precio (MXN/mes) | Propiedades | Cuartos | Mensajes (orientación) |
|------|------------------|-------------|---------|-------------------------|
| **Freemium** | $0 | 1 | 2 (total) | Correo + WhatsApp **solo**: alta de inquilino + recordatorio **3 días antes** (T-3). **Sin** email ni WhatsApp de “pago registrado”, sin T-7 ni “hoy”, sin plantillas de abono/completado/vencimiento (ahorro Resend + Meta). |
| **Básico** | $249 | 2 | 5 **por propiedad** | Ciclo completo de recordatorios **T-7, T-3, día de pago** (plantillas Kapso) + mensajes posteriores según eventos (abono, pago completado, aviso vencimiento, etc.) vía `.env` §1.3. **Sin** WhatsApp de confirmación de pago (sí correo en Básico). |
| **Pro** | $499 | 4 | **Hasta 60 cuartos en total**, distribuibles entre las 4 propiedades (no obligatorio “N por propiedad”). | Igual que Básico en email + WhatsApp, **incluyendo** WhatsApp de recibo / confirmación de pago. |
| **Patrón** | $899 | **12 propiedades fijas** | **Hasta 200 cuartos** en total | Igual que Pro en tipos de mensaje; límites altos para operadores grandes. |

### 1.1 Reglas de mensajería por plan (resumen operativo)

- **Freemium**
  - Permitir: email + WhatsApp en **creación de inquilino** (template bienvenida / confirmación registro).
  - Permitir: email + WhatsApp en **T-3** únicamente (no T-7, no “hoy”, no atrasos, no cadena post-vencimiento).
  - **No** enviar: email ni WhatsApp de **pago registrado / abono / completado**; no `EXPIRATION_NOTICE` ni equivalentes que disparen costo extra (decisión: ahorrar Resend).
- **Básico**
  - Recordatorios **T-7, T-3 y día de pago** + flujo de correos/WhatsApp según eventos (abono recibido, pago completado, avisos de vencimiento, etc.) mapeados a plantillas §1.3.
  - **Sin** WhatsApp de confirmación de pago / recibo (sí **email** de pago registrado en Básico).
- **Pro y Patrón**
  - Todo lo del Básico + **WhatsApp** de recibo / confirmación (y anulación si aplica), usando las plantillas correspondientes.

### 1.2 Mapa de plantillas Kapso (variables `.env`)

Definidas en `packages/api/src/utils/envs.ts` con **defaults** a los nombres Meta `reentwise_*` (sobrescribibles en `.env`). Resolución en código: `kapsoTemplateName("reminder_7d" | …)` en `kapso.templates.ts`.

| Variable | Default Meta | Uso |
|----------|----------------|-----|
| `KAPSO_WELCOME_TEMPLATE_NAME` | `reentwise_reminder_confirmation` | Alta de inquilino (bienvenida / contrato). |
| `KAPSO_TEMPLATE_REMINDER_7D` | `reentwise_reminder_7d` | T-7 (planes de pago). |
| `KAPSO_TEMPLATE_REMINDER_3D` | `reentwise_reminder_3d` | T-3 (freemium **solo** este; de pago también). |
| `KAPSO_TEMPLATE_REMINDER_TODAY` | `reentwise_reminder_today` | Día de pago. |
| `KAPSO_TEMPLATE_ABONO_RECIVED` | `reentwise_abono_recived` | Abono / pago parcial (Meta conserva el typo `recived`). |
| `KAPSO_TEMPLATE_PAYMENT_COMPLETED` | `reentwise_payment_completed` | Pago completado. |
| `KAPSO_TEMPLATE_EXPIRATION_NOTICE` | `reentwise_expiration_notice` | Mora / vencimiento. |

**Código actual:** builders en `packages/api/src/modules/kapso/`; bienvenida en `tenants.service` con `kapsoBodyReminderConfirmation`; **`cron.service`** usa T-7, T-3, día de pago, mora + Kapso y emails paralelos; **`payments.service`** engancha abono y pago completado en WA (y email) según flags. Pendiente: gating de bienvenida y WA de anulación.

### 1.3 Inconsistencias pendientes (producto ↔ código)

1. ~~Implementar en cron **T-7, T-3, día de pago** y mensajes post-vencimiento según plan~~ — **hecho** en código (freemium solo T-3 vía `allow_reminder_t7` / `allow_reminder_today` en semilla `plan_limits`).
2. ~~Idempotencia diaria en cron~~ — **hecho** (`hasCronReminderForDate` + notas en `audits`).
3. Gating de **bienvenida** por plan y **anulación** WA real — **pendiente**.
4. Pro “60 cuartos totales”: sigue siendo techo global, no por propiedad.

---

## 2. Estado actual en el repositorio (breve auditoría)

*Actualizado respecto al checklist superior. Si algo ya no coincide, ajusta esta sección.*

### Base de datos (`packages/database`)

- `user`: Stripe + `subscription_status` texto; **`plan_tier`** enum (`freemium` | `trial` | `basico` | `pro` | `patron`); **`subscription_current_period_end`**, **`stripe_price_id`**, **`currency`**, **`timezone`**, **`locale`**, **`business_name`**, **`tax_id`**. FK `plan_tier` → `plan_limits`.
- **`plan_limits`**: filas sembradas con máximos de propiedades/cuartos, `rooms_limit_mode` y flags booleanos de mensajería.
- `properties` / `rooms`: **`archived_at`** opcional (los guards de creación no cuentan filas archivadas).
- `tenants`, `payments`, `audits`: sin contadores de uso mensual dedicados (fase 2: `usage_monthly` o agregados).

### API (`packages/api`)

- **Stripe** (`stripe.service.ts`): escribe `plan_tier` en snake_case, cache de price y fin de periodo; **`subscription.deleted`** pone `plan_tier = freemium` y limpia campos de suscripción/precio/periodo.
- **Límites** (`plan-limits.service.ts` + `properties.service` / `rooms.service`): **sí** hay enforcement al crear propiedad o cuarto (402 si excede; respeta `archived_at`).
- **Inquilinos** (`tenants.service`): bienvenida WhatsApp con **Kapso tipado**; **sin** gating por `plan_limits` (pendiente).
- **Pagos** (`payments.service`): WA abono/completado y email según **`plan_limits`**; anulación WA **stub**.
- **Cron** (`cron.service.ts`): **T-7, T-3, día de pago**, mora + Kapso/email, **owner** + `getLimitsContext`, idempotencia en `audits`.

### Variables de entorno (`utils/envs.ts`)

- `STRIPE_PRICE_BASICO`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_PATRON` opcionales; alinear con precios 249 / 499 / 899 en Stripe Dashboard (MXN, recurrente mensual).
- Claves **`KAPSO_*`** de §1.2: obligatorias en esquema con **valores por defecto** en `processEnv` si faltan en `.env` (nombres canónicos `reentwise_*`).

---

## 3. Cambios estructurales recomendados

### 3.1 Base de datos

1. **Enum de plan** en PostgreSQL + columna en `user` — **implementado** como `plan_tier` (`freemium` | `trial` | `basico` | `pro` | `patron`); migración desde `plan_type` texto histórico en `0003`.
2. **Fuente de verdad de límites:** en este repo se eligió **tabla `plan_limits`** (semilla en migración); la API lee con `plan-limits.service.ts`. La lógica “hasta fin de periodo” tras cancelación sigue **pendiente** (ver checklist).
3. **Campos en `user`** — **implementados:** `subscriptionCurrentPeriodEnd`, `stripePriceId`, `currency`, `timezone`, `locale`, `businessName`, `taxId`.
4. **Uso y abuso (fase 2):** si más adelante cobras por volumen de mensajes, tabla `usage_monthly(user_id, year_month, whatsapp_count, email_count)` o lectura desde `audits` agregada — **pendiente**.

### 3.2 API — capa de “plan guard”

1. **Servicio `planLimits`:** — **implementado** en `plan-limits.service.ts` (`getLimitsContext`, tier efectivo, lectura de `plan_limits`). Falta extenderlo si quieres un solo DTO “rico” para el frontend.
2. **Hooks en:**
   - `createProperty` / `createRoom` — **hecho** (402 + conteos con `archived_at`).
   - **Downgrade / sobre límite:** política en UI + archivado — **pendiente** (columnas listas, flujos no).
3. **Mensajería:** flags de `plan_limits` — **hecho** en cron y payments; **pendiente** en tenants (bienvenida) y stub de anulación en payments. Capa Kapso compartida **lista**.
4. **Stripe webhooks:** cancelación → `plan_tier = freemium` y limpieza — **hecho**; `invoice.payment_failed` / `paused` — **pendiente**; `stripeCustomerId` se conserva (facturación futura).

### 3.3 Frontend (Vercel)

- Pantalla de planes + CTA checkout (price ids desde env o endpoint público).
- Mostrar uso: “2/2 propiedades”, “5/60 cuartos”.
- Deshabilitar botones de crear recurso cuando se llegue al tope (mejor UX que error solo del servidor).

### 3.4 Cron y consistencia

- **Hecho:** join a **owner**, `getLimitsContext` por dueño en cada disparo, disparadores **T-7 / T-3 / día de pago** + mora a los 2 días, plantillas §1.2 e idempotencia.
- **Freemium:** comportamiento vía semilla `plan_limits` (solo T-3 + bienvenida si luego añades gating en tenants).

---

## 4. Stripe — checklist de implementación

- [ ] Crear **Productos** y **Precios** en MXN (mensual), recurrentes: Básico 249, Pro 499, Patrón 899.
- [ ] Webhook endpoint seguro (`STRIPE_WEBHOOK_SECRET`); eventos mínimos listados arriba + `invoice.paid` si necesitas renovación explícita.
- [ ] **Customer Portal** o flujo de “administrar suscripción” (cancelar, actualizar tarjeta).
- [ ] **Trial (ej. 30 días):** límites **intermedios** entre el plan contratado y freemium (ver §11), no necesariamente techo completo del plan pago — reduce costo variable y sigue siendo “suficiente” para evaluar.
- [ ] **Impuestos MX:** Stripe Tax o facturación con IVA; revisar con contador (§5).
- [ ] **Price metadata** opcional: `plan_tier=basico` para no depender solo del mapeo por `price.id` en env.

---

## 5. Modelo de costos (orden de magnitud — **verificar** antes de fijar márgenes)

Cifras orientativas en USD/MXN según proveedores públicos a abril 2026; conviene armar una hoja con tus volúmenes reales (inquilinos activos, mensajes/mes, GB egress).

| Rubro | Notas |
|--------|--------|
| **Supabase** | Plan Pro desde ~**USD 25/mes/proyecto** + posibles sobrecostos por cómputo, almacenamiento y **egress**. Early stage suele quedarse en Pro; escala según DB size y tráfico. |
| **Vercel** | Hobby gratis con límites; Pro ~**USD 20/mes** por seat si necesitas equipo/comercial. Costo marginal bajo vs mensajería si el sitio es principalmente app router y SSR moderado. |
| **Fly.io** | Cobro por **máquinas** y ancho de banda; una app API pequeña suele ser **unos pocos USD a ~$15–40/mes** según región y tamaño. Medir con `fly metrics`. |
| **Resend (email)** | Plan gratuito limitado; escalado por volumen de correos (~7 por inquilino/mes × inquilinos). Revisar precio actual en resend.com. |
| **Kapso + WhatsApp (Meta)** | Meta cobra por **conversación** (categoría utility/marketing/etc.); hay matices (ventana 24h, conversaciones service, promociones). Kapso/BSP puede añadir fee por mensaje o por cuenta. **Regla práctica:** estimar “conversaciones/mes” ≈ número de envíos de plantilla que abren ventana, no solo recuento de templates. |
| **Stripe** | México: típicamente **~3.6% + MXN $3** por cargo con tarjeta nacional (tarifario oficial stripe.com/mx); métodos OXXO/transferencia distintos. **Excluye IVA** de Stripe en MX según documentación. |
| **Gobierno México** | **IVA 16%** sobre prestación de servicios digitales según corresponda; retenciones y obligaciones si facturas como persona moral — **obligatorio validar con contador** (CFDI, régimen, plataformas extranjeras). |

### 5.1 Idea rápida de margen bruto (ejemplo numérico)

- Cliente **Básico $249 MXN/mes** ≈ **USD ~13–14** (tipo de cambio variable).
- Solo la comisión Stripe + 1–3 conversaciones WhatsApp por inquilino ya comen una parte relevante del ticket; por eso el **freemium** acotado a 1 propiedad / 2 cuartos y pocos envíos es coherente.

---

## 6. Ideas para estructurar propiedades y cuartos (aprovechamiento sin “desperdicio”)

1. **Pro (60 cuartos totales):** en UI, mostrar **progreso global** “X/60 cuartos” y por propiedad “Y cuartos aquí”; permitir desbalance (ej. 40+10+10+0) para quien tiene un edificio grande y tres locales chicos.
2. **Sugerencia de reparto:** asistente opcional “¿Cuántas habitaciones por edificio?” que precargue números de cuarto consecutivos (101, 102…) para reducir fricción.
3. **Patrón:** agrupar por “portafolio” en la UI (etiquetas o secciones) aunque el modelo sea solo `properties`; ayuda a no sentir “propiedades vacías”.
4. **Downgrade:** avisar con lista de exceso (propiedades/cuartos a archivar o fusionar) antes de confirmar cambio de plan.

---

## 7. Orden de implementación sugerido

1. ~~**`planLimits` + migración de `planType`** y corrección webhook `subscription.deleted` (limpiar tier).~~ **Hecho** (BD + Stripe + `plan-limits.service`).
2. **Límites en `createProperty` / `createRoom`** — **hecho** en API; **faltan** tests de integración.
3. **Gating de mensajes** — **hecho** en cron y payments; **pendiente** bienvenida (`tenants`) y anulación WA.
4. **Cron por plan** (T-7, T-3, hoy, mora, Kapso, idempotencia) — **hecho**.
5. **Kapso en pagos** (abono / completado) — **hecho** con flags; **pendiente** plantilla o flujo real de **anulación**.
6. **Frontend:** pricing, checkout, indicadores de uso — **pendiente**.
7. **Monitoreo:** alertas webhook / `audits` — **pendiente**.
8. **Migración Stripe → Polar** — **planificado** (checklist §13 y subsección “Facturación — migración”).

---

## 8. Decisiones de producto cerradas (actualización)

| Tema | Decisión |
|------|----------|
| **Patrón** | **12 propiedades fijas** (producto; PSP hoy **Stripe**, migración **Polar** planificada §13). |
| **Freemium + email de pago** | **No** enviar email de “pago registrado” (ahorro Resend). |
| **Cadencia de recordatorios (pagos)** | **T-7, T-3 y día de pago**; mensajes adicionales según plantillas `.env` (abono, completado, vencimiento, etc.). |
| **Freemium** | Solo bienvenida + **T-3** (sin T-7, sin “hoy”, sin cadena de mora ni emails de pago). |
| **Trial** | Límites **intermedios** (§11), no obligatorio dar techo 100% del plan contratado durante el trial. |

---

## 9. Estrategia de precios (¿subir, bajar o mantener?)

**No hay una sola respuesta “correcta”;** depende de posicionamiento, CAC y costo variable (WhatsApp + email). Guías prácticas:

1. **No bajes precio solo por miedo.** En SaaS B2B/B2b2c, bajar precio sin subir volumen suele **empeorar** la percepción de valor y el margen; primero valida con **10–20 usuarios pagadores** entrevistados.
2. **Ancla por valor, no por costo.** Un dueño con 4 propiedades y decenas de inquilinos recupera el **Pro ($499)** con **un solo día** de renta evitada por mora; el precio está defendible si la automatización es fiable.
3. **Mantén Básico como “puerta de entrada”.** $249 es psicológicamente bajo para probar; si el costo variable te come margen, **recorta canales en Básico** (ya lo haces con WA de pago) antes de bajar precio.
4. **Sube solo con señal:** retención >3 meses, NPS positivo, o costo Meta/Resend al alza. Subidas pequeñas (5–15%) con **grandfathering** a clientes actuales generan menos fricción que un salto grande.
5. **Año vs mes:** ofrecer **2 meses gratis** en pago anual mejora LTV y cash sin tocar el precio mensual listado.
6. **Experimento seguro:** A/B de landing con **$279 vs $249** en Básico midiendo conversión (no hace falta publicar dos precios forever; puede ser test de ads).

**Resumen:** Con freemium muy limitado y Básico recortado en WA de pago, **mantener o subir levemente** tras tracción es razonable; **bajar** solo si la conversión freemium→pago está muerta y la investigación dice que el precio es el cuello (no la confianza o el producto).

---

## 10. Downgrade: políticas justas sin borrar información

**Principio:** nunca **eliminar** datos por downgrade automático. El “castigo” es **capacidad nueva** y, si quieres, **automatización** acotada.

### 10.1 Modelo recomendado (combinable)

1. **Cambio efectivo al fin del periodo pagado** (Stripe `cancel_at_period_end` o equivalente): el usuario **sigue con límites del plan actual** hasta esa fecha; después aplica el plan nuevo. Es lo que más se percibe como justo.
2. **Estado “sobre límite” (soft compliance):** si al bajar tiene 8 propiedades y el nuevo máximo es 4:
   - **Lectura y edición** de todo lo existente permitida (o edición limitada — ver abajo).
   - **Bloqueo de altas:** no crear propiedad/cuarto/inquilino nuevo hasta volver bajo el techo.
   - **Opcional:** bloquear solo “acciones que crecen deuda operativa” (nuevos inquilinos, nuevos pagos masivos) pero permitir registrar pagos de inquilinos ya existentes — reduce soporte y drama.
3. **Asistente de reorganización:** UI que lista “exceso” (propiedades/cuartos sobre cupo) y permite **archivar** (flag `archived_at` en `properties`/`rooms` sin borrar filas) o **fusionar** (fase 2). Los archivados **no cuentan** para el límite “activo” pero siguen exportables.
4. **Exportación:** botón “Descargar mi data” (CSV/JSON) antes de confirmar downgrade — cobertura legal y tranquilidad.
5. **Mensajería:** al pasar a freemium, **silenciar** envíos no permitidos desde el día efectivo; no hace falta borrar historial en `audits`.

### 10.2 Qué evitar

- Borrar propiedades/cuartos por cron o webhook.
- Dejar al usuario en “solo lectura total” de todo el exceso sin aviso claro (frustración); mejor banner + checklist.

---

## 11. Trial con límites intermedios (ejemplo numérico)

Definir un tier `trial` en código con límites entre freemium y el plan objetivo, por ejemplo si contratan **Pro**:

| Recurso | Freemium | Trial (ejemplo) | Pro pagado |
|---------|----------|-----------------|------------|
| Propiedades | 1 | **2** | 4 |
| Cuartos | 2 | **15 total** | 60 |
| Mensajes | bienvenida + T-3 | Igual que **Básico** o Pro sin WA de pago | Pro completo |

Objetivo: que prueben flujo real (T-7, T-3, hoy, emails) **sin** darte el costo de un portafolio Pro completo durante 30 días. Ajusta números a tu tolerancia de costo Meta/Resend.

---

## 12. Archivos clave a tocar en implementación

- `packages/database/src/plan-enums.ts` — enums `plan_tier`, `rooms_limit_mode` (**hecho**).
- `packages/database/src/schema.ts` — usuario / `plan_tier` y perfil (**hecho**).
- `packages/database/src/other.ts` — `plan_limits`, `archived_at` (**hecho**); uso mensual (**fase 2**).
- `packages/database/drizzle/0003_plan_limits_user_profile.sql` — migración (**hecho**; falta aplicar en cada entorno).
- `packages/api/src/modules/plan-limits/plan-limits.service.ts` — tier efectivo y guards (**hecho**; ampliar si añades fin de periodo).
- `packages/api/src/modules/stripe/stripe.service.ts` — webhooks (**hecho** para lo descrito en checklist; ampliar eventos §4 si aplica).
- `packages/api/src/modules/properties/properties.service.ts` — límite propiedades (**hecho**).
- `packages/api/src/modules/rooms/rooms.service.ts` — límite cuartos (**hecho**).
- `packages/api/src/modules/tenants/tenants.service.ts` — bienvenida Kapso tipada (**hecho**); gating por plan (**pendiente**).
- `packages/api/src/modules/cron/cron.service.ts` — T-7/T-3/hoy, mora, `plan_limits`, Kapso, emails alineados, idempotencia (**hecho**).
- `packages/api/src/modules/payments/payments.service.ts` — WA abono/completado + email según flags (**hecho**); anulación WA (**stub / pendiente**).
- `packages/api/src/modules/kapso/kapso.meta.ts`, `kapso.templates.ts`, `kapso.service.ts` — payloads Meta, builders por plantilla, envío (**hecho** para capa compartida).
- `packages/api/src/utils/envs.ts` — price IDs; claves `KAPSO_*` §1.2 con defaults (**hecho**); revisar `.env` solo si usas nombres distintos en Meta.
- Tras Polar: `polar.service.ts` (o capa billing), webhooks, `envs` `POLAR_*`, ajustes en frontend checkout/portal (**pendiente** — ver §13).

---

## 13. Plan: migrar de Stripe a Polar

**Objetivo:** usar **Polar** como proveedor de cobro y suscripciones en lugar de Stripe, **sin** romper el modelo de negocio ya modelado (`plan_tier`, `plan_limits`, tier efectivo en `plan-limits.service.ts`). El trabajo es sustituir la “capa de facturación”, no rediseñar planes.

### 13.1 Por qué plantearlo

- Menor complejidad operativa si Polar encaja mejor con SaaS (checkout, portal, webhooks) para vuestro caso.
- Revisar **coste total** (comisión + FX) y **soporte fiscal en México** frente a Stripe; no dar por hecho que Polar mejora ambos sin números.

### 13.2 Principios de diseño

1. **Misma semántica en BD:** seguir persistiendo `plan_tier`, `subscription_status`, fin de periodo y límites desde `plan_limits`; solo cambia **de dónde** llegan los eventos (webhooks Polar).
2. **IDs de cliente/suscripción:** idealmente columnas **agnósticas** (`billing_customer_id`, `billing_subscription_id`) para no arrastrar el nombre “stripe” años; migración de datos + código en un PR acotado.
3. **Corte limpio o convivencia:** definir si habrá ventana con ambos PSP (solo recomendable si hay suscripciones activas que no puedas mover de un día para otro).

### 13.3 Fases sugeridas

| Fase | Contenido |
|------|-----------|
| **A — Spike** | Leer docs Polar, probar checkout de prueba, listar eventos de webhook necesarios (activación, renovación, cancelación, pago fallido, trial). |
| **B — Paralelo en código** | Implementar handler Polar detrás de rutas nuevas (`/webhooks/polar`) sin apagar Stripe hasta validar en staging. |
| **C — Frontend** | Sustituir enlaces de checkout y “gestionar plan”; probar flujo freemium → pago → upgrade/downgrade según reglas §8. |
| **D — Cutover** | Comunicación a usuarios con suscripción Stripe; desactivar nuevas altas en Stripe; retirar `STRIPE_*` de env cuando no queden cargos recurrentes críticos. |

### 13.4 Riesgos a cerrar antes del corte

- **México:** métodos de pago, IVA, facturas (CFDI) si aplica; comparar con lo ya asumido en §4–§5 para Stripe.
- **Migración de suscriptores:** si Polar no ofrece “importar” suscripciones Stripe, el plan puede ser **solo nuevos** en Polar + legacy en Stripe hasta que caduquen.
- **Trials y `cancel_at_period_end`:** reimplementar o mapear equivalentes Polar para no empeorar la deuda ya listada en el checklist (fin de periodo al cancelar).

### 13.5 Referencia

- Documentación oficial: [polar.sh](https://polar.sh/) (API, webhooks y modelo de productos — validar siempre la versión actual).

---

*Última actualización: plan Stripe→Polar añadido (§13 + checklist); en código sigue Stripe hasta ejecutar la migración. Pendiente: gating bienvenida (tenants), WA anulación, UI planes/uso, fin de periodo al cancelar, migración BD en entornos.*
