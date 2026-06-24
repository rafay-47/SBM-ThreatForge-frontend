import { cn } from "@/lib/utils";

/**
 * GradientText — animated violet→glow gradient text, token-mapped.
 * Self-contained (no deps): pure CSS background-clip animation.
 *
 * Default gradient uses the electric-violet ramp from PLAN.md
 * (primary #7c3aed → accent #8b5cf6 → glow #a855f7). Override via `colors`.
 * Honours prefers-reduced-motion (animation disabled by the media query).
 *
 * NOTE: inline styles + `!important` on the fill color are intentional — this
 * component is often rendered inside Emotion/styled-components blocks that set
 * a higher-specificity `color` which would otherwise override `text-transparent`
 * and hide the gradient. Inline styles win specificity here.
 *
 * Props:
 *  - colors ([string]): gradient stops, defaults to the violet ramp
 *  - animationSpeed (number): seconds per loop, default 8
 *  - className
 */
const DEFAULT_COLORS = ["#7c3aed", "#8b5cf6", "#a855f7", "#8b5cf6"];

export default function GradientText({
  children,
  colors = DEFAULT_COLORS,
  animationSpeed = 8,
  className,
  as: Tag = "span",
}) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <Tag
      className={cn("rb-gradient-text", className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: "300% 100%",
        animationName: "rb-gradient-pan",
        animationDuration: `${animationSpeed}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        // Inline + !important: beats Emotion/styled-component `color` specificity.
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent !important",
      }}
    >
      {children}
      <style>{`
        @keyframes rb-gradient-pan {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rb-gradient-text { animation: none !important; }
        }
      `}</style>
    </Tag>
  );
}
