import Link from "next/link";
import { connection } from "next/server";
import { getList, type ListRow } from "@/lib/queries";
import { rs } from "@/lib/format";
import { clearDone } from "@/app/actions";
import DbError from "@/components/DbError";
import ListRowItem from "@/components/ListRowItem";
import ConfirmButton from "@/components/ConfirmButton";

export default async function ListPage() {
  await connection();
  let rows: ListRow[];
  try {
    rows = await getList();
  } catch (e) {
    return <DbError error={e} />;
  }

  const groups = new Map<string, { title: string; street: string | null; shopId: number | null; rows: ListRow[] }>();
  for (const r of rows) {
    const key = r.shop_id ? String(r.shop_id) : "none";
    if (!groups.has(key)) {
      groups.set(key, { title: r.shop_name ?? "Not priced yet", street: r.street, shopId: r.shop_id, rows: [] });
    }
    groups.get(key)!.rows.push(r);
  }

  const cost = rows.reduce((t, r) => t + (r.unit ?? 0) * r.qty, 0);
  // Revenue and profit only count items that have both a cost and a retail price.
  const complete = rows.filter((r) => r.retail_price != null && r.unit != null);
  const revenue = complete.reduce((t, r) => t + r.retail_price! * r.qty, 0);
  const profit = complete.reduce((t, r) => t + (r.retail_price! - r.unit!) * r.qty, 0);
  const allHaveRetail = complete.length === rows.length;
  const done = rows.filter((r) => r.done).length;

  return (
    <>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Buy list</h1>
        <p className="text-sm text-muted">Grouped by the cheapest shop for each item.</p>
      </header>

      {rows.length === 0 ? (
        <div className="card p-5 text-center text-sm text-muted">
          Nothing on the list. Open an{" "}
          <Link href="/" className="text-accent">
            item
          </Link>{" "}
          and tap “+ Buy list”.
        </div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-2 text-center">
            <div className="card p-3">
              <div className="text-xs text-muted">Cash needed</div>
              <div className="mt-1 font-bold">{rs(cost)}</div>
            </div>
            <div className="card p-3">
              <div className="text-xs text-muted">Sells for{allHaveRetail ? "" : "*"}</div>
              <div className="mt-1 font-bold">{complete.length ? rs(revenue) : "—"}</div>
            </div>
            <div className="card p-3">
              <div className="text-xs text-muted">Profit{allHaveRetail ? "" : "*"}</div>
              <div className={`mt-1 font-bold ${profit < 0 ? "text-bad" : "text-accent"}`}>
                {complete.length ? rs(profit) : "—"}
              </div>
            </div>
          </div>
          {!allHaveRetail && complete.length > 0 && (
            <p className="-mt-3 mb-4 text-xs text-muted">* Only counts items that have both a price and a retail price.</p>
          )}

          <div className="space-y-5">
            {[...groups.values()].map((g) => {
              const sub = g.rows.reduce((t, r) => t + (r.unit ?? 0) * r.qty, 0);
              return (
                <section key={g.title}>
                  <div className="mb-2 flex items-end justify-between gap-2">
                    <div>
                      {g.shopId ? (
                        <Link href={`/shops/${g.shopId}`} className="font-semibold">
                          {g.title}
                        </Link>
                      ) : (
                        <span className="font-semibold text-warn">{g.title}</span>
                      )}
                      {g.street && <div className="text-xs text-muted">{g.street}</div>}
                    </div>
                    {g.shopId && <div className="text-sm font-semibold">{rs(sub)}</div>}
                  </div>
                  <ul className="card divide-y divide-line">
                    {g.rows.map((r) => (
                      <ListRowItem key={r.id} row={r} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          {done > 0 && (
            <div className="mt-6 text-center">
              <ConfirmButton action={clearDone} message={`Remove ${done} bought item(s) from the list?`} className="btn btn-ghost">
                Clear {done} bought
              </ConfirmButton>
            </div>
          )}
        </>
      )}
    </>
  );
}
