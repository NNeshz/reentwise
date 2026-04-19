"use client";

import * as React from "react";
import { usePayments } from "@/modules/payment/hooks/use-payments";
import { usePaymentsFilters } from "@/modules/payment/store/use-payments-filters";
import type { PaymentListRow } from "@/modules/payment/types/payment.types";
import { PaymentModal } from "@/modules/payment/components/payment-modal";
import { PaymentRow } from "@/modules/payment/components/payment-row";
import { PaymentRowCard } from "@/modules/payment/components/payment-row-card";
import { PaymentsListFrame } from "@/modules/payment/components/payments-list-frame";
import { PaymentsTableHeader } from "@/modules/payment/components/payments-table-header";
import { PaymentsListSkeleton } from "@/modules/payment/components/payments-list-skeleton";
import { PaymentsListEmpty } from "@/modules/payment/components/payments-list-empty";
import { PaymentsListError } from "@/modules/payment/components/payments-list-error";
import {
  PaymentsResultSummary,
  type PaymentsViewMode,
} from "@/modules/payment/components/payments-result-summary";
import { PaymentsPagination } from "@/modules/payment/components/payments-pagination";
import { TenantPaymentsSheet } from "@/modules/tenants/components/tenant-payments-sheet";

const VIEW_STORAGE_KEY = "payments-view";

function getInitialView(): PaymentsViewMode {
  if (typeof window === "undefined") return "list";
  const stored = localStorage.getItem(VIEW_STORAGE_KEY);
  return stored === "grid" ? "grid" : "list";
}

export function PaymentsList() {
  const { data, isPending, error, isFetching, refetch, isRefetching } =
    usePayments();
  const { month, year, setPage } = usePaymentsFilters();

  const [payRow, setPayRow] = React.useState<PaymentListRow | null>(null);
  const [viewRow, setViewRow] = React.useState<PaymentListRow | null>(null);
  const [view, setView] = React.useState<PaymentsViewMode>(getInitialView);

  function handleViewChange(v: PaymentsViewMode) {
    setView(v);
    localStorage.setItem(VIEW_STORAGE_KEY, v);
  }

  const rows = data?.payments ?? [];
  const pagination = data?.pagination;

  if (isPending) return <PaymentsListSkeleton view={view} />;

  if (error) {
    return (
      <PaymentsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (rows.length === 0) return <PaymentsListEmpty />;

  return (
    <div className="space-y-2">
      <PaymentsResultSummary
        count={pagination?.totalItems ?? rows.length}
        isFetching={isFetching && !isPending}
        view={view}
        onViewChange={handleViewChange}
      />

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <PaymentRowCard
              key={row.payment?.id ?? row.tenant.id}
              row={row}
              month={month}
              year={year}
              onRegisterPayment={setPayRow}
              onViewPayments={setViewRow}
            />
          ))}
        </div>
      ) : (
        <PaymentsListFrame>
          <PaymentsTableHeader />
          <ul className="flex flex-col gap-1" role="list">
            {rows.map((row) => (
              <PaymentRow
                key={row.payment?.id ?? row.tenant.id}
                row={row}
                month={month}
                year={year}
                onRegisterPayment={setPayRow}
                onViewPayments={setViewRow}
              />
            ))}
          </ul>
        </PaymentsListFrame>
      )}

      {pagination && (
        <PaymentsPagination
          pagination={pagination}
          onPrevious={() => setPage(pagination.currentPage - 1)}
          onNext={() => setPage(pagination.currentPage + 1)}
        />
      )}

      {payRow?.payment && (
        <PaymentModal
          isOpen
          onClose={() => setPayRow(null)}
          onSuccess={() => void refetch()}
          paymentId={payRow.payment.id}
          tenantName={payRow.tenant.name}
          totalAmount={Number(payRow.payment.amount)}
          amountPaid={Number(payRow.payment.amountPaid ?? 0)}
        />
      )}

      <TenantPaymentsSheet
        tenantId={viewRow?.tenant.id ?? null}
        tenantName={viewRow?.tenant.name ?? ""}
        open={!!viewRow}
        onOpenChange={(open) => {
          if (!open) setViewRow(null);
        }}
      />
    </div>
  );
}
