"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "wpc_hint_dismissed";
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

/** One-time pointer to the tutorial, shown until dismissed. */
export default function FirstVisitHint() {
  const dismissed = useSyncExternalStore(subscribe, read, () => true);
  if (dismissed) return null;
  const remember = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };
  const dismiss = () => {
    remember();
    listeners.forEach((l) => l());
  };
  return (
    <div className="card mb-4 flex items-center gap-3 border-accent bg-accent-soft p-3 text-sm">
      <span className="text-2xl" aria-hidden>
        👋
      </span>
      <div className="flex-1">
        <div className="font-semibold">New here? / අලුත්ද?</div>
        {/* Only remember here: hiding the hint mid-click would cancel the navigation. */}
        <Link href="/help" onClick={remember} className="font-semibold text-accent underline">
          Open the tutorial · උපදෙස් බලන්න
        </Link>
      </div>
      <button type="button" onClick={dismiss} className="min-h-8 min-w-8 text-muted" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
