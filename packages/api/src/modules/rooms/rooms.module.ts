import Elysia from "elysia";
import { roomsService } from "@reentwise/api/src/modules/rooms/rooms.service";

export const roomsModule = new Elysia({
  name: "roomsModule",
}).decorate({
  roomsService: roomsService,
});