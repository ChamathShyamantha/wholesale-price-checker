"use client";

import { useSyncExternalStore } from "react";

// Current tour step, or null when the tour isn't running. Kept in sessionStorage so it
// survives page changes during the tour but not closing the app.
const KEY = "wpc_tour_step";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function read(): number | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v == null ? null : Number(v);
  } catch {
    return null;
  }
}

export function useTourStep(): number | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function setTourStep(step: number | null) {
  try {
    if (step == null) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, String(step));
  } catch {}
  listeners.forEach((l) => l());
}

export function startTour() {
  setTourStep(0);
}
