import { cn } from "@reentwise/ui/src/lib/utils";
import { HIW_NOISE_BG_IMAGE } from "@/modules/howitworks/lib/howitworks-display";

type NoiseOverlayProps = {
  className?: string;
  opacityClassName?: string;
};

const NOISE_STYLE = {
  backgroundImage: HIW_NOISE_BG_IMAGE,
  backgroundRepeat: "repeat" as const,
};

/** Textura reutilizable sobre fotos (misma URL que el resto de la landing). */
export function NoiseOverlay({ className, opacityClassName }: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay",
        opacityClassName,
        className,
      )}
      style={NOISE_STYLE}
    />
  );
}
