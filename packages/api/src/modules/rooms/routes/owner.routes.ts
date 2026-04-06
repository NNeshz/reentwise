import Elysia, { t } from "elysia";
import { betterAuthPlugin } from "@reentwise/api/src/utils/better-auth-plugin";
import { roomsModule } from "@reentwise/api/src/modules/rooms/rooms.module";

export const ownerRoomsRoutes = new Elysia({
  name: "ownerRoomsRoutes",
  prefix: "/rooms/owner",
})
  .use(betterAuthPlugin)
  .use(roomsModule)
  .get(
    "/:propertyId",
    ({ params, roomsService }) => {
      return roomsService.getPropertyRooms(params.propertyId);
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
      }),
    },
  )
  .get(
    "/:propertyId/:id",
    ({ params, roomsService }) => {
      return roomsService.getRoomById(params.propertyId, params.id);
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
        id: t.String(),
      }),
    },
  )
  .post(
    "/:propertyId",
    ({ user, params, body, roomsService }) => {
      return roomsService.createRoom(user.id, params.propertyId, body);
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
      }),
      body: t.Object({
        roomNumber: t.String(),
        price: t.String(),
        notes: t.Optional(t.String()),
      }),
    },
  )
  .put(
    "/:propertyId/:id",
    ({ user, params, body, roomsService }) => {
      return roomsService.updateRoom(params.propertyId, params.id, body);
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
        id: t.String(),
      }),
      body: t.Object({
        roomNumber: t.Optional(t.String()),
        price: t.Optional(t.String()),
        notes: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/:propertyId/:id",
    ({ user, params, roomsService }) => {
      return roomsService.deleteRoom(params.propertyId, params.id);
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
        id: t.String(),
      }),
    },
  )
  .put(
    "/:propertyId/:id/status",
    ({ user, params, body, roomsService }) => {
      return roomsService.updateRoomStatus(
        params.propertyId,
        params.id,
        body.status,
      );
    },
    {
      authenticated: true,
      params: t.Object({
        propertyId: t.String(),
        id: t.String(),
      }),
      body: t.Object({
        status: t.String(),
      }),
    },
  );
