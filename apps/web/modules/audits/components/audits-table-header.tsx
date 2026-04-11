import { auditsTableHeaderRowClassName } from "@/modules/audits/lib/audit-display";

export function AuditsTableHeader() {
  return (
    <div className={auditsTableHeaderRowClassName()}>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Fecha / hora
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Canal
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Estado
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Inquilino
      </div>
      <div className="text-xs font-normal uppercase tracking-wide text-muted-foreground">
        Nota
      </div>
    </div>
  );
}
