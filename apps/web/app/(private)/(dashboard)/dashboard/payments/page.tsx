import { PaymentsHeader } from "@/modules/payment/components/payments-header";
import { PaymentsFilters } from "@/modules/payment/components/payments-filters";
import { PaymentsList } from "@/modules/payment/components/payments-list";

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
      <PaymentsHeader />
      <PaymentsFilters />
      <PaymentsList />
    </div>
  );
}
