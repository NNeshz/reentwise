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

export const roomsPropertyParamsSchema = t.Object({
  propertyId: t.String(),
});

export const roomsPropertyRoomParamsSchema = t.Object({
  propertyId: t.String(),
  id: t.String(),
});

export const createRoomBodySchema = t.Object({
  roomNumber: t.String(),
  price: t.String(),
  notes: t.Optional(t.String()),
});

export const updateRoomBodySchema = t.Object({
  roomNumber: t.Optional(t.String()),
  price: t.Optional(t.String()),
  notes: t.Optional(t.String()),
});

export const updateRoomStatusBodySchema = t.Object({
  status: t.String(),
});

export const roomsListSuccessSchema = envelopeOk;
export const roomDetailSuccessSchema = envelopeOk;
export const roomMutationSuccessSchema = envelopeOk;
export const roomNotFoundSchema = err(404);
export const roomPlanLimitSchema = err(402);
export const roomBadRequestSchema = err(400);
export const roomServerErrorSchema = err(500);
