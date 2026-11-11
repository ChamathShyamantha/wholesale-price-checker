import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getShop, listShops } from "@/lib/queries";
import { rs, shortDate } from "@/lib/format";
import DbError from "@/components/DbError";
import EditShopForm from "@/components/EditShopForm";

export default async function ShopPage({ params }: PageProps<"/shops/[id]">) {
  await connection();
  const id = Number((await params).id);
  if (!id) notFound();
  let data, shops;
  try {
    [data, shops] = await Promise.all([getShop(id), listShops()]);
  } catch (e) {
    return <DbError error={e} />;
  }
  if (!data) notFound();
  const { shop, items } = data;
  const streets = [...new Set(shops.map((s) => s.street).filter(Boolean))].sort();
  const toCheck = items.filter((i) => i.here_unit == null);
  const priced = items.filter((i) => i.here_unit != null);
  const mapsHref =
    shop.maps_url ||
    (shop.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, Colombo`)}` : null);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/shops" className="text-sm text-accent">
          ← Shops
        </Link>
        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight">{shop.name}</h1>
        <p className="text-sm text-muted">
          {shop.street}
          {shop.address ? ` · ${shop.address}` : ""}
        </p>
        {shop.notes && <p className="mt-1 text-sm">{shop.notes}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/add?shop=${shop.id}`} className="btn btn-primary">
            + Add price here
          </Link>
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="btn btn-ghost">
              Call
            </a>
          )}
          {mapsHref && (
            <a href={mapsHref} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Map
            </a>
          )}
        </div>
      </div>

      {toCheck.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">To check here ({toCheck.length})</h2>
          <ul className="space-y-2">
            {toCheck.map((i) => (
              <li key={i.id} className="card flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <Link href={`/products/${i.id}`} className="font-medium">
                    {i.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {i.best_unit != null ? `Best so far ${rs(i.best_unit)}/pc at ${i.best_shop}` : "Not priced anywhere yet"}
                  </p>
                </div>
                <Link href={`/add?shop=${shop.id}&product=${i.id}`} className="btn btn-ghost shrink-0 text-sm">
                  Price
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 font-semibold">Prices here ({priced.length})</h2>
        {priced.length === 0 && <p className="card p-4 text-sm text-muted">No prices recorded at this shop yet.</p>}
        <ul className="space-y-2">
          {priced.map((i) => {
            const isBest = i.best_unit != null && i.here_unit! <= i.best_unit;
            return (
              <li key={i.id}>
                <Link href={`/products/${i.id}`} className={`card block p-3 ${isBest ? "border-accent" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-muted">
                        {i.here_date ? shortDate(i.here_date) : ""}
                        {i.here_moq ? ` · MOQ ${i.here_moq}` : ""}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`font-bold ${isBest ? "text-accent" : ""}`}>{rs(i.here_unit)}/pc</div>
                      {i.here_pack! > 1 && (
                        <div className="text-xs text-muted">
                          {rs(i.here_price)} / {i.here_pack}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-xs">
                    {isBest ? (
                      <span className="text-accent">★ Cheapest known</span>
                    ) : (
                      <span className="text-warn">
                        {i.best_shop} is {rs(i.here_unit! - i.best_unit!)} cheaper
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <EditShopForm shop={shop} streets={streets} />
    </div>
  );
}
