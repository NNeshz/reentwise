import { PropertiesCreate } from "@/modules/properties/components/properties-create";
import { PropertiesFilters } from "@/modules/properties/components/properties-filters";

export function PropertiesHeader() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full flex-col text-left md:w-auto md:gap-1">
          <h1 className="text-2xl font-bold">Propiedades</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus propiedades de forma sencilla y eficiente.
          </p>
        </div>
        <PropertiesCreate />
      </div>
      <PropertiesFilters />
    </div>
  );
}

