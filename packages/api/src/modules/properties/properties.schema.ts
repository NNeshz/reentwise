import { t } from "elysia";

const envelopeOk = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Any(),
});

const err = (code: number) =>
  t.Object({
    success: t.Literal(false),
    status: t.Literal(code),
    message: t.String(),
  });

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

export const propertiesListSuccessSchema = envelopeOk;
export const propertyOneSuccessSchema = envelopeOk;
export const propertyMutationSuccessSchema = envelopeOk;
export const propertyNotFoundSchema = err(404);
export const propertyPlanLimitSchema = err(402);
export const propertyServerErrorSchema = err(500);
