import { cn } from "@reentwise/ui/src/lib/utils";

type NoiseOverlayProps = {
  className?: string;
  opacityClassName?: string;
};

const NOISE_STYLE = {
  backgroundImage: 'url("/images/noise.webp")',
  backgroundRepeat: "repeat" as const,
};

/** Textura reutilizable sobre fotos (misma URL que el resto de la landing). */
export function NoiseOverlay({ className, opacityClassName }: NoiseOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 mix-blend-overlay pointer-events-none",
        opacityClassName,
        className,
      )}
      style={NOISE_STYLE}
    />
  );
}
