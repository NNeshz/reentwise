import { Badge } from "@reentwise/ui/src/components/badge";
import { cn } from "@reentwise/ui/src/lib/utils";
import {
  auditStatusBadgeClassName,
  auditStatusLabel,
} from "@/modules/audits/lib/audit-display";
import type { AuditStatus } from "@/modules/audits/types/audits.types";

type Props = {
  status: AuditStatus;
};

export function AuditStatusBadge({ status }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn("w-fit font-medium", auditStatusBadgeClassName(status))}
    >
      {auditStatusLabel(status)}
    </Badge>
  );
}
