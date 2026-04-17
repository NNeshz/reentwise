import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const contractIdParamsSchema = t.Object({
  contractId: t.String(),
});

export const createContractBodySchema = t.Object({
  tenantId: t.String(),
  roomId: t.String(),
  rentAmount: t.String(),
  paymentDay: t.Number(),
  deposit: t.Optional(t.String()),
  startsAt: t.String({ format: "date-time" }),
  endsAt: t.Optional(t.String({ format: "date-time" })),
  notes: t.Optional(t.String()),
});

export const setPdfUrlBodySchema = t.Object({
  pdfUrl: t.String(),
});

export const updateContractBodySchema = t.Partial(
  t.Object({
    rentAmount: t.String(),
    paymentDay: t.Number(),
    deposit: t.String(),
    endsAt: t.Nullable(t.String({ format: "date-time" })),
    notes: t.Nullable(t.String()),
  }),
);

export const contractsListQuerySchema = t.Object({
  search: t.Optional(t.String()),
});

export const contractsSuccessSchema = apiSuccessAnyDataSchema;
export const contractsError404Schema = apiErrorEnvelopeSchema(404);
export const contractsError500Schema = apiErrorEnvelopeSchema(500);
