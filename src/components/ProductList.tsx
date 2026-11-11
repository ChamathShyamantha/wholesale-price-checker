"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { ProductRow } from "@/lib/queries";
import { margin, pct, rs } from "@/lib/format";

type Status = "all" | "check" | "priced" | "noretail";

const STATUS: { key: Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "check", label: "To check" },
  { key: "priced", label: "Priced" },
  { key: "noretail", label: "No retail price" },
];

const ICONS: Record<string, string> = {
  Jewellery: "💍",
  Skincare: "🧴",
  Makeup: "💄",
  Hair: "🎀",
  Perfume: "🌸",
  Bags: "👜",
  Toys: "🧸",
  Fancy: "🪞",
  Home: "🏠",
  Packaging: "📦",
};

// Remember the street filter between visits (per phone).
const STREET_KEY = "wpc_street";
function subscribe() {
  return () => {};
}
function readStreet() {
  try {
    return localStorage.getItem(STREET_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function ProductList({ products }: { products: ProductRow[] }) {
  const [search, setSearch] = useState("");
  const savedStreet = useSyncExternalStore(subscribe, readStreet, () => "");
  const [streetPick, setStreetPick] = useState<string | null>(null);
  const street = streetPick ?? savedStreet;
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<Status>("all");

  const streets = useMemo(() => [...new Set(products.flatMap((p) => p.streets))].sort(), [products]);
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  const pickStreet = (s: string) => {
    setStreetPick(s);
    try {
      localStorage.setItem(STREET_KEY, s);
    } catch {}
  };

  const shown = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (street && !p.streets.includes(street)) return false;
    if (category && p.category !== category) return false;
    if (status === "check" && p.priced_count > 0) return false;
    if (status === "priced" && p.priced_count === 0) return false;
    if (status === "noretail" && p.retail_price != null) return false;
    return true;
  });

  // The tour spotlights a priced item if there is one, so it can explain the green price.
  const tourCardId = (shown.find((p) => p.best_unit != null) ?? shown[0])?.id;

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 bg-bg/95 px-4 pb-2 pt-1 backdrop-blur">
        <input
          className="field"
          type="search"
          data-tour="item-search"
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto" data-tour="filter-status">
          {STATUS.map((s) => (
            <button key={s.key} className="chip" data-on={status === s.key} onClick={() => setStatus(s.key)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto" data-tour="filter-street">
          <button className="chip" data-on={!street} onClick={() => pickStreet("")}>
            All streets
          </button>
          {streets.map((s) => (
            <button key={s} className="chip" data-on={street === s} onClick={() => pickStreet(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          <button className="chip" data-on={!category} onClick={() => setCategory("")}>
            All types
          </button>
          {categories.map((c) => (
            <button key={c} className="chip" data-on={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && <p className="py-10 text-center text-muted">No items match.</p>}

      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {shown.map((p) => {
          const m = margin(p.best_unit, p.retail_price);
          return (
            <li key={p.id} data-tour={p.id === tourCardId ? "item-card" : undefined}>
              <Link href={`/products/${p.id}`} className="card flex h-full gap-3 p-3 active:scale-[0.99]">
                {p.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-bg text-2xl" aria-hidden>
                    {ICONS[p.category] ?? "📦"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold leading-snug">{p.name}</h2>
                    {p.on_list && <span className="shrink-0 text-xs text-accent">● list</span>}
                  </div>
                  {p.best_unit != null ? (
                    <p className="mt-1 text-sm">
                      <span className="font-semibold text-accent">{rs(p.best_unit)}</span>
                      <span className="text-muted">/pc · {p.best_shop}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-warn">Not checked yet</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted">
                    {p.priced_count}/{p.shop_count} shops priced
                    {p.retail_price != null && (
                      <>
                        {" · "}sell {rs(p.retail_price)}
                        {m != null && (
                          <span className={m < 0 ? "text-bad" : "text-accent"}>
                            {" "}
                            ({rs(p.retail_price - (p.best_unit ?? 0))} · {pct(m)})
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
