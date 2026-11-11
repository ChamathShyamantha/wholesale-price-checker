"use client";

import { useOptimistic, useTransition } from "react";
import { setListQty } from "@/app/actions";

/** Add to / adjust quantity on the buy list. */
export default function ListQty({ productId, qty }: { productId: number; qty: number | null }) {
  const [optimistic, setOptimistic] = useOptimistic(qty ?? 0);
  const [, start] = useTransition();
  const set = (n: number) =>
    start(async () => {
      setOptimistic(Math.max(0, n));
      await setListQty(productId, Math.max(0, n));
    });

  if (!optimistic) {
    return (
      <button type="button" className="btn btn-ghost shrink-0" onClick={() => set(1)}>
        + Buy list
      </button>
    );
  }
  return (
    <div className="card flex shrink-0 items-center">
      <button type="button" className="h-11 w-11 text-xl" onClick={() => set(optimistic - 1)} aria-label="Less">
        −
      </button>
      <input
        className="w-12 bg-transparent text-center font-semibold outline-none"
        inputMode="numeric"
        value={optimistic}
        onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")) || 0)}
        aria-label="Quantity"
      />
      <button type="button" className="h-11 w-11 text-xl" onClick={() => set(optimistic + 1)} aria-label="More">
        +
      </button>
    </div>
  );
}
