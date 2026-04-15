import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";

export function OwnerProfileFormError({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl space-y-4 rounded-lg border border-destructive/40 bg-destructive/5 p-6",
        className,
      )}
    >
      <p className="text-sm font-medium text-destructive">
        No se pudieron cargar los ajustes
      </p>
      <p className="text-muted-foreground text-sm">
        {error instanceof Error ? error.message : "Intenta de nuevo más tarde."}
      </p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
