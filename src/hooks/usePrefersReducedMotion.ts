import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function supportsMatchMedia(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

export function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (!supportsMatchMedia()) return () => undefined;

    const mediaQuery = window.matchMedia(QUERY);
    mediaQuery.addEventListener("change", onStoreChange);
    return () => mediaQuery.removeEventListener("change", onStoreChange);
  }, []);

  const getSnapshot = useCallback(
    () => (supportsMatchMedia() ? window.matchMedia(QUERY).matches : false),
    [],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
