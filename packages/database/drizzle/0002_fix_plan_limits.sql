-- Añade columna allow_whatsapp_abono_receipt para diferenciar WA en abonos vs pago completo.
-- Corrige flags de reminders y WA por tier:
--   freemium: WA para pago completo solamente (abono=false)
--   basico:   T7=false, T3=true, WA para ambos (full + abono)
--   pro:      max_rooms=15
--   patron:   max_rooms=25

-- freemium: habilita WA para pago completo; abono queda false (default)
UPDATE "plan_limits"
SET "allow_whatsapp_payment_receipt" = true
WHERE "tier" = 'freemium';
--> statement-breakpoint

-- trial: habilita WA para abonos también (trial = full features)
UPDATE "plan_limits"
SET "allow_whatsapp_abono_receipt" = true
WHERE "tier" = 'trial';
--> statement-breakpoint

-- basico: T7=false, T3=true, rooms_limit_mode=total, WA para full + abono
UPDATE "plan_limits"
SET "allow_reminder_t7"            = false,
    "allow_reminder_t3"            = true,
    "rooms_limit_mode"             = 'total',
    "allow_whatsapp_payment_receipt" = true,
    "allow_whatsapp_abono_receipt"   = true
WHERE "tier" = 'basico';
--> statement-breakpoint

-- pro: max_rooms=15, habilita WA abono
UPDATE "plan_limits"
SET "max_rooms"                    = 15,
    "allow_whatsapp_abono_receipt"   = true
WHERE "tier" = 'pro';
--> statement-breakpoint

-- patron: max_rooms=25, habilita WA abono
UPDATE "plan_limits"
SET "max_rooms"                    = 25,
    "allow_whatsapp_abono_receipt"   = true
WHERE "tier" = 'patron';
