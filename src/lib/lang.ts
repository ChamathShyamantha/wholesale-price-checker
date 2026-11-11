"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "si";

const KEY = "wpc_lang";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "si" ? "si" : "en";
  } catch {
    return "en";
  }
}

/** Tutorial language (English / Sinhala), remembered on this phone and shared by the guide and the tour. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, read, () => "en" as Lang);
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  listeners.forEach((l) => l());
}
