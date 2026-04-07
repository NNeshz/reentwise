"use client";

import { IconDoor } from "@tabler/icons-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@reentwise/ui/src/components/empty";
import { ROOMS_LIST_STACK_CLASS } from "@/modules/rooms/lib/room-display";

type Variant = "no-data" | "no-matches";

const COPY: Record<Variant, { title: string; description: string }> = {
  "no-data": {
    title: "Sin habitaciones",
    description: "Agrega la primera habitación con el botón de abajo.",
  },
  "no-matches": {
    title: "Ninguna habitación coincide",
    description: "Prueba otro término o limpia los filtros.",
  },
};

export function RoomsListEmpty({ variant }: { variant: Variant }) {
  const { title, description } = COPY[variant];

  return (
    <div className={ROOMS_LIST_STACK_CLASS}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconDoor className="size-6" stroke={1.5} />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
