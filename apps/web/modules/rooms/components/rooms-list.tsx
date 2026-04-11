"use client";

import * as React from "react";
import { ScrollArea } from "@reentwise/ui/src/components/scroll-area";
import { useRooms } from "@/modules/rooms/hooks/use-rooms";
import { useRoomsFiltersForProperty } from "@/modules/rooms/store/use-rooms-filters";
import type { RoomListItem } from "@/modules/rooms/types/rooms.types";
import {
  compareRoomsBySort,
  ROOMS_LIST_STACK_CLASS,
} from "@/modules/rooms/lib/room-display";
import { RoomsDetails } from "@/modules/rooms/components/rooms-details";
import { RoomListCard } from "@/modules/rooms/components/room-list-card";
import { RoomsFilters } from "@/modules/rooms/components/rooms-filters";
import { RoomsListSkeleton } from "@/modules/rooms/components/rooms-list-skeleton";
import { RoomsListEmpty } from "@/modules/rooms/components/rooms-list-empty";
import { RoomsListError } from "@/modules/rooms/components/rooms-list-error";

function useFilteredSortedRooms(
  propertyId: string,
  rooms: RoomListItem[],
): RoomListItem[] {
  const { search, sortBy } = useRoomsFiltersForProperty(propertyId);

  return React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rooms;
    if (q) {
      list = rooms.filter((r) => {
        const num = r.roomNumber.toLowerCase().includes(q);
        const notes = (r.notes ?? "").toLowerCase().includes(q);
        return num || notes;
      });
    }
    const next = [...list];
    next.sort((a, b) => compareRoomsBySort(a, b, sortBy));
    return next;
  }, [rooms, search, sortBy]);
}

export function RoomsList({
  propertyId,
  nestedInParentSheet = false,
}: {
  propertyId: string;
  /** Listado dentro del Sheet de la propiedad (habilita `modal={false}` en cada habitación). */
  nestedInParentSheet?: boolean;
}) {
  const { data: rooms = [], isPending, error, refetch, isRefetching } =
    useRooms(propertyId);

  const visible = useFilteredSortedRooms(propertyId, rooms);

  if (isPending) {
    return <RoomsListSkeleton />;
  }

  if (error) {
    return (
      <RoomsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  return (
    <>
      <RoomsFilters propertyId={propertyId} />
      {rooms.length === 0 ? (
        <RoomsListEmpty variant="no-data" />
      ) : visible.length === 0 ? (
        <RoomsListEmpty variant="no-matches" />
      ) : (
        <ScrollArea className="h-full min-h-0 pr-2">
          <div className={ROOMS_LIST_STACK_CLASS}>
            {visible.map((room) => (
              <RoomsDetails
                key={room.id}
                nestedInParentSheet={nestedInParentSheet}
                propertyId={propertyId}
                roomId={room.id}
              >
                <button
                  type="button"
                  className="group w-full cursor-pointer rounded-xl border-0 bg-transparent p-0 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <RoomListCard room={room} />
                </button>
              </RoomsDetails>
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
