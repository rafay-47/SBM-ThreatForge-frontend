import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * DecryptedText — text that scrambles through random characters before
 * revealing the real string. Self-contained (no deps).
 *
 * Thematically ideal for a security/threat tool. Token-mapped: the resolved
 * (revealed) text inherits the parent color; the scrambling glyphs default to
 * the electric-violet accent (--color-primary / --token-accent-primary) and can
 * be overridden via the `scrambleClassName` prop.
 *
 * Honours prefers-reduced-motion (renders the plain final string).
 *
 * Props:
 *  - text (string, required)
 *  - duration (ms per char reveal, default 35)
 *  - maxIterations (scramble frames before locking each char, default 8)
 *  - speed (ms between scramble frames, default 1)
 *  - sequential (bool, default true): reveal left-to-right (true) or all at once
 *  - characters (string): glyph pool, default hex + symbols
 *  - scrambleClassName: applied to scrambling characters
 *  - className: applied to the resolved text
 *  - as: element tag, default "span"
 *  - animateOn (string, default "mount"): "mount" | "hover" | "both"
 */
const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}=+*^?#";

export default function DecryptedText({
  text,
  duration = 35,
  maxIterations = 8,
  speed = 1,
  sequential = true,
  characters = DEFAULT_CHARS,
  scrambleClassName = "text-primary",
  className,
  as: Tag = "span",
  animateOn = "mount",
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const [revealed, setRevealed] = useState(animateOn === "hover");
  const frameRef = useRef(null);
  const timeoutRef = useRef(null);
  const iterationRef = useRef(0);

  // runScramble is stable; defined with useCallback so it can be a dep safely.
  const runScramble = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRevealed(false);
    iterationRef.current = 0;
    const chars = characters.split("");

    const frame = () => {
      const iter = iterationRef.current;
      setDisplay((prev) =>
        prev
          .split("")
          .map((char, idx) => {
            if (char === " ") return " ";
            const lockThreshold = sequential ? idx * (duration / (text.length || 1)) : 0;
            if (iter * speed > lockThreshold + duration * 0.6) return text[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iterationRef.current += 1;
      if (iter * speed >= duration * text.length + maxIterations * speed) {
        setDisplay(text);
        setRevealed(true);
        return;
      }
      timeoutRef.current = setTimeout(() => {
        frameRef.current = requestAnimationFrame(frame);
      }, speed);
    };

    frameRef.current = requestAnimationFrame(frame);
  }, [characters, duration, maxIterations, sequential, speed, text]);

  // Run on mount / when text changes (unless hover-only).
  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      setRevealed(true);
      return undefined;
    }
    if (animateOn === "hover") return undefined;
    runScramble();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, reduced, animateOn, runScramble]);

  // Re-trigger on hover when configured.
  const handleMouseEnter = () => {
    if (reduced || (animateOn !== "hover" && animateOn !== "both")) return;
    runScramble();
  };

  return (
    <Tag
      className={cn(
        "rb-decrypted-text",
        className,
        (animateOn === "hover" || animateOn === "both") && "cursor-pointer"
      )}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      <span className={cn(!revealed && scrambleClassName)}>{display}</span>
    </Tag>
  );
}
