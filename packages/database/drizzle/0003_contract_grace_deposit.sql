-- Agrega días de gracia configurables por contrato y campos de seguimiento del depósito
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS grace_days              INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS deposit_collected_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deposit_amount_collected NUMERIC(10,2);
