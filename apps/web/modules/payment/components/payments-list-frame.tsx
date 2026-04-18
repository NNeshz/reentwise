import type { ReactNode } from "react";

type Props = { children: ReactNode };

export function PaymentsListFrame({ children }: Props) {
  return <div className="overflow-x-auto bg-transparent">{children}</div>;
}
