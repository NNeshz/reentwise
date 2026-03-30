import { Header } from "@/modules/metrics/components/header";
import { MetricsCards } from "@/modules/metrics/components/metrics-cards";
import { MetricsFilter } from "@/modules/metrics/components/metrics-filter";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header />
      <MetricsFilter />
      <MetricsCards />
    </div>
  );
}
