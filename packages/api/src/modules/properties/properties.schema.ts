import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

export const propertyIdParamsSchema = t.Object({
  id: t.String(),
});

export const createPropertyBodySchema = t.Object({
  name: t.String(),
  address: t.Optional(t.String()),
});

export const updatePropertyBodySchema = t.Object({
  name: t.String(),
  address: t.Optional(t.String()),
});

export const setPropertyArchivedBodySchema = t.Object({
  archived: t.Boolean(),
});

export const propertiesListSuccessSchema = apiSuccessAnyDataSchema;
export const propertyOneSuccessSchema = apiSuccessAnyDataSchema;
export const propertyMutationSuccessSchema = apiSuccessAnyDataSchema;
export const propertyNotFoundSchema = apiErrorEnvelopeSchema(404);
export const propertyPlanLimitSchema = apiErrorEnvelopeSchema(402);
export const propertyServerErrorSchema = apiErrorEnvelopeSchema(500);
