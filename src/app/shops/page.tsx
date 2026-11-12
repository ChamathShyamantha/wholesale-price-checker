import Link from "next/link";
import { connection } from "next/server";
import { listShops } from "@/lib/queries";
import DbError from "@/components/DbError";
import NewShopForm from "@/components/NewShopForm";

export default async function ShopsPage() {
  await connection();
  let shops;
  try {
    shops = await listShops();
  } catch (e) {
    return <DbError error={e} />;
  }
  const byStreet = new Map<string, typeof shops>();
  for (const s of shops) {
    const key = s.street || "Other";
    byStreet.set(key, [...(byStreet.get(key) ?? []), s]);
  }
  const streets = [...byStreet.keys()];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Shops</h1>
        <p className="text-sm text-muted">
          {shops.length} shops on {byStreet.size} streets
        </p>
      </header>

      <div data-tour="shops-new">
        <NewShopForm streets={streets} />
      </div>

      <div className="mt-5 space-y-6">
        {streets.map((street) => (
          <section key={street}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{street}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {byStreet.get(street)!.map((s) => {
                const left = s.item_count - s.priced_count;
                return (
                  <li key={s.id} data-tour={s.id === shops[0]?.id ? "shop-card" : undefined}>
                    <Link href={`/shops/${s.id}`} className="card flex h-full gap-3 p-3">
                      {s.photo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                      <div className="font-semibold">{s.name}</div>
                      {s.address && <div className="text-xs text-muted">{s.address}</div>}
                      <div className="mt-1 text-sm">
                        <span className="text-muted">{s.item_count} items</span>
                        {left > 0 ? (
                          <span className="text-warn"> · {left} to check</span>
                        ) : s.item_count > 0 ? (
                          <span className="text-accent"> · all priced</span>
                        ) : null}
                      </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
