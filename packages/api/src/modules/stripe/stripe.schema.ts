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

export const stripeCreateCheckoutBodySchema = t.Object({
  priceId: t.String(),
});

/** @deprecated Use stripeCreateCheckoutBodySchema — mismo esquema. */
export const crearSuscripcionBodySchema = stripeCreateCheckoutBodySchema;

export const stripeCheckoutSuccessSchema = t.Object({
  success: t.Literal(true),
  status: t.Literal(200),
  message: t.String(),
  data: t.Object({
    url: t.String(),
  }),
});

export const stripeBadRequestSchema = err(400);
export const stripeBadGatewaySchema = err(502);
export const stripeServiceUnavailableSchema = err(503);
export const stripeServerErrorSchema = err(500);
