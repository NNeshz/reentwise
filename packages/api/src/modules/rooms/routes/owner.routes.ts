import Elysia from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { roomsModule } from "@reentwise/api/src/modules/rooms/rooms.module";
import { PlanLimitExceededError } from "@reentwise/api/src/modules/plan-limits/plan-limits.service";
import { RoomNotFoundError } from "@reentwise/api/src/modules/rooms/lib/room-not-found-error";
import { InvalidRoomStatusError } from "@reentwise/api/src/modules/rooms/lib/invalid-room-status-error";
import { apiSuccess, apiError } from "@reentwise/api/src/utils/api-envelope";
import {
  roomsPropertyParamsSchema,
  roomsPropertyRoomParamsSchema,
  createRoomBodySchema,
  updateRoomBodySchema,
  updateRoomStatusBodySchema,
  roomsListSuccessSchema,
  roomDetailSuccessSchema,
  roomMutationSuccessSchema,
  roomNotFoundSchema,
  roomPlanLimitSchema,
  roomBadRequestSchema,
  roomServerErrorSchema,
} from "@reentwise/api/src/modules/rooms/rooms.schema";
import { openApiTags } from "@reentwise/api/src/utils/openapi-meta";

function mapRoomsRouteError(e: unknown, set: { status?: number | string }) {
  if (e instanceof RoomNotFoundError) {
    set.status = 404;
    return apiError(404, e.message);
  }
  if (e instanceof PlanLimitExceededError) {
    set.status = 402;
    return apiError(402, e.message);
  }
  if (e instanceof InvalidRoomStatusError) {
    set.status = 400;
    return apiError(400, e.message);
  }
  const message =
    e instanceof Error ? e.message : "An unknown error occurred";
  set.status = 500;
  return apiError(500, message);
}

export const ownerRoomsRoutes = new Elysia({
  name: "ownerRoomsRoutes",
  prefix: "/rooms/owner",
})
  .use(betterAuthPlugin)
  .use(roomsModule)
  .get(
    "/:propertyId",
    async ({ params, roomsService, set }) => {
      try {
        const data = await roomsService.getPropertyRooms(params.propertyId);
        return apiSuccess("Rooms retrieved successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyParamsSchema,
      response: {
        200: roomsListSuccessSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Listar cuartos de una propiedad",
        tags: [openApiTags.Rooms],
      },
    },
  )
  .get(
    "/:propertyId/:id",
    async ({ params, roomsService, set }) => {
      try {
        const data = await roomsService.getRoomById(
          params.propertyId,
          params.id,
        );
        return apiSuccess("Room retrieved successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyRoomParamsSchema,
      response: {
        200: roomDetailSuccessSchema,
        404: roomNotFoundSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Obtener cuarto por ID",
        tags: [openApiTags.Rooms],
      },
    },
  )
  .post(
    "/:propertyId",
    async ({ user, params, body, roomsService, set }) => {
      try {
        const data = await roomsService.createRoom(
          user.id,
          params.propertyId,
          body,
        );
        return apiSuccess("Room created successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyParamsSchema,
      body: createRoomBodySchema,
      response: {
        200: roomMutationSuccessSchema,
        402: roomPlanLimitSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Crear cuarto",
        description: "402 si el plan no permite más cuartos.",
        tags: [openApiTags.Rooms],
      },
    },
  )
  .put(
    "/:propertyId/:id",
    async ({ params, body, roomsService, set }) => {
      try {
        const data = await roomsService.updateRoom(
          params.propertyId,
          params.id,
          body,
        );
        return apiSuccess("Room updated successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyRoomParamsSchema,
      body: updateRoomBodySchema,
      response: {
        200: roomMutationSuccessSchema,
        404: roomNotFoundSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Actualizar cuarto",
        tags: [openApiTags.Rooms],
      },
    },
  )
  .delete(
    "/:propertyId/:id",
    async ({ params, roomsService, set }) => {
      try {
        const data = await roomsService.deleteRoom(
          params.propertyId,
          params.id,
        );
        return apiSuccess("Room deleted successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyRoomParamsSchema,
      response: {
        200: roomMutationSuccessSchema,
        404: roomNotFoundSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Eliminar cuarto",
        tags: [openApiTags.Rooms],
      },
    },
  )
  .put(
    "/:propertyId/:id/status",
    async ({ params, body, roomsService, set }) => {
      try {
        const data = await roomsService.updateRoomStatus(
          params.propertyId,
          params.id,
          body.status,
        );
        return apiSuccess("Room status updated successfully", data);
      } catch (e) {
        return mapRoomsRouteError(e, set);
      }
    },
    {
      authenticated: true,
      params: roomsPropertyRoomParamsSchema,
      body: updateRoomStatusBodySchema,
      response: {
        200: roomMutationSuccessSchema,
        404: roomNotFoundSchema,
        400: roomBadRequestSchema,
        500: roomServerErrorSchema,
      },
      detail: {
        summary: "Actualizar estado del cuarto",
        tags: [openApiTags.Rooms],
      },
    },
  );
