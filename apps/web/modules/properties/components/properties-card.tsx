"use client";

import * as React from "react";
import {
  IconBuildingSkyscraper,
  IconChevronRight,
  IconDoor,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@reentwise/ui/src/components/card";
import { Progress } from "@reentwise/ui/src/components/progress";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import type { PropertyListItem } from "@/modules/properties/types/properties.types";
import {
  formatPropertyAddress,
  propertyOccupancyPercent,
  PROPERTY_ROOMS_LABEL,
} from "@/modules/properties/lib/property-display";

type Props = {
  property: PropertyListItem;
  onSelect: (property: PropertyListItem) => void;
};

export function PropertiesCard({ property, onSelect }: Props) {
  const totalRooms = property.totalRooms;
  const occupied = property.occupiedRooms;
  const occupancyRate = propertyOccupancyPercent(property);

  return (
    <div
      role="button"
      tabIndex={0}
      className="group block w-full cursor-pointer text-left outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      onClick={() => onSelect(property)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(property);
        }
      }}
    >
      <Card className="w-full rounded-2xl border-border bg-card transition-colors group-hover:border-accent group-hover:bg-accent/40">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="bg-primary/10">
                <AvatarFallback>
                  <IconBuildingSkyscraper className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="truncate text-base font-semibold">
                  {property.name}
                </CardTitle>
                <CardDescription className="truncate text-xs">
                  {formatPropertyAddress(property.address)}
                </CardDescription>
              </div>
            </div>
            <IconChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mt-1">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Ocupación</span>
              <span className="font-medium text-foreground">
                {occupancyRate}%
              </span>
            </div>
            <Progress value={occupancyRate} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <IconDoor className="h-4 w-4" />
              <span>
                {totalRooms} {PROPERTY_ROOMS_LABEL(totalRooms)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconUsers className="h-4 w-4" />
              <span>{occupied} ocupados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
