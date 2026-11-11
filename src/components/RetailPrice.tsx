"use client";

import { useState, useTransition } from "react";
import { setRetailPrice } from "@/app/actions";
import { margin, pct, retailForMargin, rs } from "@/lib/format";

const TARGETS = [30, 40, 50, 60];

export default function RetailPrice({
  productId,
  retail,
  cost,
}: {
  productId: number;
  retail: number | null;
  cost: number | null;
}) {
  const [value, setValue] = useState(retail != null ? String(retail) : "");
  const [pending, start] = useTransition();
  const n = value.trim() ? Number(value.replace(/,/g, "")) : null;
  const valid = n == null || Number.isFinite(n);
  const changed = (n ?? null) !== retail;
  const m = margin(cost, n);

  return (
    <div className="card space-y-3 p-3">
      <div className="flex gap-2">
        <input
          className="field text-lg font-semibold"
          inputMode="decimal"
          placeholder="Your selling price (Rs)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary shrink-0"
          disabled={!changed || !valid || pending}
          onClick={() => start(() => setRetailPrice(productId, n))}
        >
          {pending ? "…" : "Save"}
        </button>
      </div>
      {cost != null && n != null && valid && (
        <p className={`text-sm ${m != null && m < 0 ? "text-bad" : "text-accent"}`}>
          Profit {rs(n - cost)} per piece · {pct(m)} margin
        </p>
      )}
      {cost != null && (
        <div>
          <p className="mb-1.5 text-xs text-muted">Suggested prices (best cost {rs(cost)}):</p>
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((t) => {
              const r = retailForMargin(cost, t);
              return (
                <button key={t} type="button" className="chip" onClick={() => setValue(String(r))}>
                  {t}% → {rs(r)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
