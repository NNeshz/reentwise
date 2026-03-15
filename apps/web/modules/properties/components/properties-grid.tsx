"use client";

import * as React from "react";
import { useProperties } from "@/modules/properties/hooks/use-properties";
import { PropertiesCard } from "@/modules/properties/components/properties-card";
import { PropertiesRooms } from "@/modules/properties/components/properties-rooms";

export function PropertiesGrid() {
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<
    string | null
  >(null);

  const { data: properties, isLoading, isError } = useProperties();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading properties</div>;
  }

  const propertiesList = Array.isArray(properties) ? properties : [];

  if (propertiesList.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-2xl h-[50vh] flex items-center justify-center">
        No hay propiedades todavía
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertiesList.map((property) => (
          <PropertiesCard
            key={property.id}
            property={property}
            onSelect={(p) => setSelectedPropertyId(p.id)}
          />
        ))}
      </div>
      {selectedPropertyId && (
        <PropertiesRooms
          propertyId={selectedPropertyId}
          open={!!selectedPropertyId}
          onOpenChange={(open) => !open && setSelectedPropertyId(null)}
        />
      )}
    </>
  );
}
