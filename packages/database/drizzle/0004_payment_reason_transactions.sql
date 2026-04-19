-- Normalización de pagos: razón, snapshot de nombre, FK con SET NULL, y tabla de transacciones

-- 1. Enum de razón de cobro
CREATE TYPE "public"."payment_reason" AS ENUM('rent', 'deposit', 'extra');

-- 2. Columna reason (todos los existentes son 'rent')
ALTER TABLE payments ADD COLUMN IF NOT EXISTS reason payment_reason NOT NULL DEFAULT 'rent';

-- 3. Snapshot del nombre del inquilino
ALTER TABLE payments ADD COLUMN IF NOT EXISTS tenant_name varchar(255);

-- 4. Backfill: llenar tenant_name con el nombre actual del inquilino
UPDATE payments p SET tenant_name = t.name FROM tenants t WHERE t.id = p.tenant_id;

-- 5. FK tenant_id → SET NULL al borrar inquilino (preserva historial)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_tenant_id_tenants_id_fk;
ALTER TABLE payments ALTER COLUMN tenant_id DROP NOT NULL;
ALTER TABLE payments ADD CONSTRAINT payments_tenant_id_tenants_id_fk
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

-- 6. FK contract_id → SET NULL al borrar contrato
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_contract_id_contracts_id_fk;
ALTER TABLE payments ADD CONSTRAINT payments_contract_id_contracts_id_fk
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL;

-- 7. Tabla de transacciones de pago (abonos y pagos completos)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  method payment_method,
  notes text,
  created_at timestamp DEFAULT now()
);
