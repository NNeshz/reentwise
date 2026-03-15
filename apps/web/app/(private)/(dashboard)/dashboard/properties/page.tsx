import { PropertiesHeader } from "@/modules/properties/components/properties-header";
import { PropertiesGrid } from "@/modules/properties/components/properties-grid";

export default function PropertiesPage() {
  return (
    <div className="space-y-4">
      <PropertiesHeader />
      <PropertiesGrid />
    </div>
  );
}
