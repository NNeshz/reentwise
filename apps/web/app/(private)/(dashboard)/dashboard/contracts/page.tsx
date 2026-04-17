import { ContractsHeader } from "@/modules/contracts/components/contracts-header";
import { ContractsFilters } from "@/modules/contracts/components/contracts-filters";
import { ContractsList } from "@/modules/contracts/components/contracts-list";

export default function ContractsPage() {
  return (
    <div className="space-y-4">
      <ContractsHeader />
      <ContractsFilters />
      <ContractsList />
    </div>
  );
}
