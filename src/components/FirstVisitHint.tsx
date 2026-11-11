"use client";

import { useSyncExternalStore } from "react";
import { startTour } from "@/lib/tourStore";

const KEY = "wpc_hint_dismissed";
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

/** One-time offer of the guided tour, shown until used or dismissed. */
export default function FirstVisitHint() {
  const dismissed = useSyncExternalStore(subscribe, read, () => true);
  if (dismissed) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    listeners.forEach((l) => l());
  };
  return (
    <div className="card mb-4 flex items-center gap-3 border-accent bg-accent-soft p-3 text-sm">
      <span className="text-2xl" aria-hidden>
        👋
      </span>
      <div className="flex-1">
        <div className="font-semibold">New here? / අලුත්ද?</div>
        <button
          type="button"
          onClick={() => {
            dismiss();
            startTour();
          }}
          className="text-left font-semibold text-accent underline"
        >
          Take the tour · චාරිකාව අරඹන්න
        </button>
      </div>
      <button type="button" onClick={dismiss} className="min-h-8 min-w-8 text-muted" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
