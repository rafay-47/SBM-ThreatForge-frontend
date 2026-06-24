import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * SpotlightCard — a cursor-following radial glow over a card surface.
 * Self-contained (no deps): tracks pointer position via a CSS variable and
 * renders the glow with a masked radial-gradient overlay.
 *
 * PLAN.md compliant: hover feedback is glow + border only — NO scale/translate.
 * Honours prefers-reduced-motion (static soft glow, no cursor tracking).
 *
 * Token-mapped: glow defaults to the electric-violet primary
 * (--token-accent-primary / --color-primary). Override via `spotlightColor`.
 *
 * Props:
 *  - spotlightColor (CSS color, default violet primary)
 *  - spotlightSize (px, default 220)
 *  - radius (className, default rounded-2xl → 16px per PLAN §2.3)
 *  - className, innerClassName
 */
export default function SpotlightCard({
  children,
  spotlightColor = "var(--token-accent-primary, #7c3aed)",
  spotlightSize = 220,
  className,
  innerClassName,
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 }); // percentage
  const [hovered, setHovered] = useState(false);

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group/spotlight relative overflow-hidden rounded-2xl border transition-colors duration-300",
        "border-border hover:border-primary/40",
        className
      )}
    >
      {/* Cursor-follow glow. Masked so it only shows within the card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${pos.x}% ${pos.y}%, ${spotlightColor}, transparent 70%)`,
          maskImage: "radial-gradient(closest-side, black, transparent)",
          WebkitMaskImage: "radial-gradient(closest-side, black, transparent)",
        }}
      />
      <div className={cn("relative z-10", innerClassName)}>{children}</div>
    </div>
  );
}
