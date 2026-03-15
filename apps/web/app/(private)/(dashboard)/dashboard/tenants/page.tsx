import { TenantsHeader } from "@/modules/tenants/components/tenants-header";
import { TenantsFilters } from "@/modules/tenants/components/tenants-filters";
import { TenantsList } from "@/modules/tenants/components/tenants-list";

export default function TenantsPage() {
  return (
    <div className="space-y-4">
      <TenantsHeader />
      <TenantsFilters />
      <TenantsList />
    </div>
  );
}