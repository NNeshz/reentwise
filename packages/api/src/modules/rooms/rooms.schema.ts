import { t } from "elysia";
import {
  apiSuccessAnyDataSchema,
  apiErrorEnvelopeSchema,
} from "@reentwise/api/src/utils/api-envelope.schema";

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

export const setRoomArchivedBodySchema = t.Object({
  archived: t.Boolean(),
});

export const roomsListSuccessSchema = apiSuccessAnyDataSchema;
export const roomDetailSuccessSchema = apiSuccessAnyDataSchema;
export const roomMutationSuccessSchema = apiSuccessAnyDataSchema;
export const roomNotFoundSchema = apiErrorEnvelopeSchema(404);
export const roomPlanLimitSchema = apiErrorEnvelopeSchema(402);
export const roomBadRequestSchema = apiErrorEnvelopeSchema(400);
export const roomServerErrorSchema = apiErrorEnvelopeSchema(500);
