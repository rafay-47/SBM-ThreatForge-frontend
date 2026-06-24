import { cn } from "@/lib/utils";

/**
 * DotGrid — a subtle dot-matrix background, token-mapped to electric-violet.
 * Self-contained (no deps): pure SVG background via CSS radial-gradient.
 *
 * Maps to PLAN.md §2.3 (.bg-grid texture utility). Low opacity so it reads as
 * texture, not pattern. Respects reduced-motion (no parallax drift).
 *
 * Props:
 *  - dotSize (px, default 1.2)
 *  - gap (px, default 22)
 *  - opacity (0–1, default 0.15) — auto-dims in light mode
 *  - color (CSS color, defaults to the violet primary token)
 *  - className / style
 */
export default function DotGrid({
  dotSize = 1.2,
  gap = 22,
  opacity = 0.15,
  color = "var(--token-accent-primary, #7c3aed)",
  className,
  style,
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("rb-dot-grid pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity,
        ...style,
      }}
    />
  );
}
