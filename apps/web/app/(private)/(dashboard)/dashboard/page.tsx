import { Header, MetricsCards, MetricsFilter } from "@/modules/metrics";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header />
      <MetricsFilter />
      <MetricsCards />
    </div>
  );
}
