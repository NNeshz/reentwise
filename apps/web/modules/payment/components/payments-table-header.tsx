import {
  PAYMENTS_TABLE_GRID_CLASS,
  paymentsTableHeaderRowClassName,
} from "@/modules/payment/lib/payment-display";

function Col({ children }: { children: string }) {
  return (
    <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

export function PaymentsTableHeader() {
  return (
    <div className={paymentsTableHeaderRowClassName()}>
      <Col>Inquilino</Col>
      <Col>Habitación</Col>
      <Col>Estado</Col>
      <Col>Razón</Col>
      <Col>Total</Col>
      <Col>Pagado</Col>
      <div />
    </div>
  );
}
