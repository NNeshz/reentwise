"use client";

import * as React from "react";
import { usePayments } from "@/modules/payment/hooks/use-payments";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import type { PaymentListRow } from "@/modules/payment/types/payment.types";
import { PAYMENTS_LIST_STACK_CLASS } from "@/modules/payment/lib/payment-display";
import { PaymentModal } from "@/modules/payment/components/payment-modal";
import { PaymentRowCard } from "@/modules/payment/components/payment-row-card";
import { PaymentsListSkeleton } from "@/modules/payment/components/payments-list-skeleton";
import { PaymentsListEmpty } from "@/modules/payment/components/payments-list-empty";
import { PaymentsListError } from "@/modules/payment/components/payments-list-error";
import { PaymentsResultSummary } from "@/modules/payment/components/payments-result-summary";

export function PaymentsList() {
  const {
    data: rows = [],
    isPending,
    error,
    isFetching,
    refetch,
    isRefetching,
  } = usePayments();
  const { month, year } = usePaymentsFilters();
  const [selectedRow, setSelectedRow] = React.useState<PaymentListRow | null>(
    null,
  );

  if (isPending) {
    return <PaymentsListSkeleton />;
  }

  if (error) {
    return (
      <PaymentsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (rows.length === 0) {
    return <PaymentsListEmpty />;
  }

  return (
    <div className="space-y-4">
      <PaymentsResultSummary
        count={rows.length}
        isFetching={isFetching && !isPending}
      />

      <ul className={PAYMENTS_LIST_STACK_CLASS} role="list">
        {rows.map((row) => (
          <li key={row.tenant.id}>
            <PaymentRowCard
              row={row}
              month={month}
              year={year}
              onRegisterPayment={setSelectedRow}
            />
          </li>
        ))}
      </ul>

      {selectedRow?.payment ? (
        <PaymentModal
          isOpen={!!selectedRow}
          onClose={() => setSelectedRow(null)}
          onSuccess={() => void refetch()}
          paymentId={selectedRow.payment.id}
          tenantName={selectedRow.tenant.name}
          totalAmount={Number(selectedRow.payment.amount)}
          amountPaid={Number(selectedRow.payment.amountPaid ?? 0)}
        />
      ) : null}
    </div>
  );
}
