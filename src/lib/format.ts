export function rs(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return "Rs " + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function pct(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return Math.round(n) + "%";
}

/** Margin as % of retail price. */
export function margin(cost: number | null | undefined, retail: number | null | undefined): number | null {
  if (cost == null || retail == null || retail <= 0) return null;
  return ((retail - cost) / retail) * 100;
}

/** Retail price that gives the target margin, rounded up to the nearest 10. */
export function retailForMargin(cost: number, marginPct: number): number {
  const raw = cost / (1 - marginPct / 100);
  return Math.ceil(raw / 10) * 10;
}

export function shortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit", timeZone: "Asia/Colombo" });
}

export function num(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).replace(/,/g, "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function str(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}
