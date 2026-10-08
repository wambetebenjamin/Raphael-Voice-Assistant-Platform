"use client";

import { useCallback, useSyncExternalStore } from "react";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** SSR-safe prefers-reduced-motion hook used by every effect fallback. */
export function useReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(REDUCE_QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false
  );
}

/** True once the tab is visible — used to pause ambient animation loops. */
export function useTabVisible(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => document.visibilityState === "visible",
    () => true
  );
}

/**
 * Viewport-width hook (SSR-safe: server renders `false`).
 * Used for viewport-dependent defaults such as the flipbook's text mode.
 */
export function useIsNarrow(breakpoint = 768): boolean {
  const query = `(max-width: ${breakpoint}px)`;
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
