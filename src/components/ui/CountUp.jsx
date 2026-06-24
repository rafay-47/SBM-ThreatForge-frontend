import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * CountUp — animated number that eases from `from` to `to`.
 * Self-contained (no deps): uses requestAnimationFrame + an ease-out curve.
 *
 * Token-mapped to the electric-violet system: inherits the parent text color,
 * so it renders in --token-text-primary / -secondary just like the surrounding
 * dashboard numbers. Honours prefers-reduced-motion (renders final value).
 *
 * Props:
 *  - from (number, default 0)
 *  - to (number, required)
 *  - duration (ms, default 1500)
 *  - decimals (number, default 0)
 *  - prefix / suffix (string)
 *  - className (merged onto the <span>)
 */
export default function CountUp({
  from = 0,
  to,
  duration = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(from);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (reduced || from === to) {
      setDisplay(to);
      return undefined;
    }

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startRef.current = null;
    };
  }, [from, to, duration, reduced]);

  const formatted = Number.isFinite(display)
    ? display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : to;

  return (
    <span className={cn(className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
