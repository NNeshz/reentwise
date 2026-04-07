import { useCallback, useSyncExternalStore } from "react";

const THRESHOLD_PX = 50;

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.scrollY > THRESHOLD_PX;
}

function getServerSnapshot() {
  return false;
}

/**
 * Estado de “navbar scrolled” vía `useSyncExternalStore` (sin `useEffect`).
 */
export function useLandingNavbarScroll() {
  const subscribeStable = useCallback(subscribe, []);
  return useSyncExternalStore(subscribeStable, getSnapshot, getServerSnapshot);
}
