import {
  AUDITS_TABLE_GRID_CLASS,
  formatAuditLoggedAt,
} from "@/modules/audits/lib/audit-display";
import { AuditChannelLabel } from "@/modules/audits/components/audit-channel-label";
import { AuditStatusBadge } from "@/modules/audits/components/audit-status-badge";
import type { AuditRow as AuditRowType } from "@/modules/audits/types/audits.types";

type Props = {
  row: AuditRowType;
};

export function AuditRow({ row }: Props) {
  return (
    <li className="py-3 text-sm">
      <div className={AUDITS_TABLE_GRID_CLASS}>
        <span className="font-mono text-xs text-muted-foreground">
          {formatAuditLoggedAt(row.loggedAt)}
        </span>
        <AuditChannelLabel channel={row.channel} />
        <AuditStatusBadge status={row.status} />
        <span className="min-w-0 font-medium text-foreground">
          <span className="line-clamp-2">{row.tenantName}</span>
        </span>
        <span className="min-w-0 text-xs leading-snug text-muted-foreground">
          <span className="line-clamp-3 whitespace-normal">
            {row.note || "—"}
          </span>
        </span>
      </div>
    </li>
  );
}
