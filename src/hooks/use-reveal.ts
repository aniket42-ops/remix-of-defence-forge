import { useEffect, useRef } from "react";

/**
 * Adds `is-visible` to `.reveal-up` descendants when they scroll into view.
 * Attach the returned ref to a container element.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(".reveal-up");
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}

/**
 * Animated counter that counts up when the element scrolls into view.
 */
export function useCounter(target: number, durationMs = 1500) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const step = (now: number) => {
              const p = Math.min(1, (now - start) / durationMs);
              const eased = 1 - Math.pow(1 - p, 3);
              const value = Math.round(target * eased);
              if (el) el.textContent = value.toLocaleString();
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  return ref;
}
