import { AuditsHeader } from "@/modules/audits/components/audits-header";
import { AuditsFilters } from "@/modules/audits/components/audits-filters";
import { AuditsList } from "@/modules/audits/components/audits-list";

export default function AuditsPage() {
  return (
    <div className="space-y-4">
      <AuditsHeader />
      <AuditsFilters />
      <AuditsList />
    </div>
  );
}
