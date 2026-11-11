"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { toggleListDone } from "@/app/actions";
import type { ListRow } from "@/lib/queries";
import { rs } from "@/lib/format";
import ListQty from "./ListQty";

export default function ListRowItem({ row }: { row: ListRow }) {
  const [done, setDone] = useOptimistic(row.done);
  const [, start] = useTransition();
  const cost = row.unit != null ? row.unit * row.qty : null;

  return (
    <li className={`flex items-center gap-3 p-3 ${done ? "opacity-50" : ""}`}>
      <input
        type="checkbox"
        className="h-6 w-6 shrink-0 accent-[var(--accent)]"
        checked={done}
        onChange={(e) => {
          const v = e.target.checked;
          start(async () => {
            setDone(v);
            await toggleListDone(row.id, v);
          });
        }}
        aria-label="Bought"
      />
      <div className="min-w-0 flex-1">
        <Link href={`/products/${row.product_id}`} className={`block font-medium ${done ? "line-through" : ""}`}>
          {row.name}
        </Link>
        <div className="text-xs text-muted">
          {row.unit != null ? `${rs(row.unit)}/pc` : "no price yet"}
          {cost != null ? ` · ${rs(cost)}` : ""}
          {row.moq ? ` · MOQ ${row.moq}` : ""}
          {row.retail_price != null && row.unit != null ? ` · profit ${rs((row.retail_price - row.unit) * row.qty)}` : ""}
        </div>
      </div>
      <ListQty productId={row.product_id} qty={row.qty} />
    </li>
  );
}
