# TODO — API Reentwise

Resumen del estado **real** del código (abril 2026). Facturación: **Polar** (`packages/api/src/modules/billing/`). “Ticket” aquí = **solicitud del usuario** que puede desembocar en **descuento sobre la mensualidad** si aplica (producto + integración con Polar).

Cada ítem es solo el pendiente y **cómo comprobar** que funciona.

---

## Pendientes

- [ ] **Tickets de descuento en mensualidad**  
  - **Qué es:** flujo para que una persona **abra un ticket** (motivo, texto, opcional adjunto); un **operador o reglas** deciden si corresponde **bonificar / descontar** la siguiente (o varias) renovación. **Hoy:** no existe modelo ni rutas; el checkout sigue siendo `POST /api/billing/crear-suscripcion` (otro concepto).  
  - **Diseño mínimo a cerrar:** tabla `support_tickets` (o nombre que elijas) ligada a `user_id`, estados (`open`, `approved`, `rejected`, `applied`), monto o porcentaje, vigencia; política “solo si tiene suscripción activa en Polar”. **Polar:** definir si el descuento es **cupón**, **crédito**, **ajuste en suscripción** o **proceso manual** en dashboard + reflejo en BD; documentar en el código qué API de Polar usar.  
  - **Listo cuando:** el usuario puede **crear** ticket autenticado; puede **ver** el estado del suyo; al aprobar y aplicar, el **siguiente cobro** (o el acordado) refleja el descuento en Polar **y** queda registro en BD idempotente (no doble descuento por el mismo ticket).

- [x] **Downgrade de propiedades (y cuartos) vía archivado**  
  - **Implementado:** `PATCH /api/properties/owner/:id/archive` cuerpo `{ "archived": true|false }`; `PATCH /api/rooms/owner/:propertyId/:id/archive` igual. Listado `GET /api/properties/owner` solo activas por defecto; `?includeArchived=true` incluye archivadas. Conteos de cuartos en listado/detalle excluyen cuartos archivados. Detalle `GET …/owner/:id` incluye `archivedAt` (ISO). Rutas de cuartos verifican que la propiedad pertenezca al usuario.  
  - **Prueba:** plan con tope N propiedades, N+1 activas → archivar una → `POST` crear propiedad → 200 (no 402).

- [ ] **Mostrar propiedades (confianza en listado/detalle)**  
  - **Hoy:** `GET /api/properties/owner` y `GET /api/properties/owner/:id` existen; la web usa `useProperties` / `propertiesService`.  
  - **Listo cuando:** en app logueada ves la cuadrícula sin error; en red, `GET …/properties/owner` devuelve 200 y el cuerpo coincide con lo que parsea el cliente (`id`, `name`, `address`, `totalRooms`, `occupiedRooms`; en detalle también `archivedAt` opcional). Si falla, revisar cookie/sesión, `NEXT_PUBLIC_BACKEND_URL` y rewrite de `/api` en Next.

- [ ] **Suscripción: manejo completo (Polar + producto)**  
  - **Hoy:** webhook `POST /api/billing/webhook` con firma Standard Webhooks; sincroniza suscripción, órdenes, cliente, checkout y varios eventos (`billing.service.ts`). Tier efectivo con gracia si `subscription_status === canceled` y aún no vence el periodo (`plan-limits/lib/effective-plan-tier.ts`).  
  - **Listo cuando:** (1) Polar dashboard: entregas de webhook sin errores y usuario de prueba refleja estado en BD; (2) flujos reales: upgrade/downgrade de producto, cancelación y fin de periodo se comportan como producto (p. ej. portal del cliente Polar enlazado desde la app si lo necesitas); (3) **idempotencia** y eventos duplicados no corrompen datos (hoy no hay tabla de deduplicación por `webhook-id` — valorar si Polar reintenta).  
  - **Plan en el front:** `GET /api/billing/plan` (sesión) devuelve tier efectivo, límites y uso activo.

---

## Referencia rápida (no es TODO)

| Área | Rutas / archivos |
|------|-------------------|
| Propiedades owner | `packages/api/src/modules/properties/routes/owner.routes.ts` |
| Límites | `packages/api/src/modules/plan-limits/plan-limits.service.ts` |
| Polar checkout + webhook + plan (lectura) | `billing.service.ts`, `routes/webhook.routes.ts`, `routes/owner.routes.ts` (`GET …/billing/plan`) |
| OpenAPI | `GET /api/openapi` (servidor en marcha) |
