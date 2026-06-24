import { useEffect, useState } from "react";

/**
 * Subscribes to the user's `prefers-reduced-motion` setting.
 * React-Bits-style animation effects must gate themselves on this hook so the
 * app honours PLAN.md §4 / §7 ("prefers-reduced-motion respected").
 *
 * Returns `true` when the user has requested reduced motion. SSR-safe.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduced(event.matches);
    // addEventListener is supported on all modern browsers; fall back to legacy API.
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

export default useReducedMotion;
