import { PaymentsHeader } from "@/modules/payment/components/payments-header";
import { PaymentsToolbar } from "@/modules/payment/components/payments-toolbar";
import { PaymentsGrid } from "@/modules/payment/components/payments-grid";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PaymentsHeader />
      <PaymentsToolbar />
      <PaymentsGrid />
    </div>
  );
}
