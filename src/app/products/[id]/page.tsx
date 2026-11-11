import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProduct } from "@/lib/queries";
import { margin, pct, rs, shortDate } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";
import { deletePrice } from "@/app/actions";
import RetailPrice from "@/components/RetailPrice";
import ProductDetailsForm from "@/components/ProductDetailsForm";
import ListQty from "@/components/ListQty";
import ConfirmButton from "@/components/ConfirmButton";
import DbError from "@/components/DbError";

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  await connection();
  const id = Number((await params).id);
  if (!id) notFound();
  let data;
  try {
    data = await getProduct(id);
  } catch (e) {
    return <DbError error={e} />;
  }
  if (!data) notFound();
  const { product, offers, unchecked, history, listQty } = data;
  const best = offers[0] ?? null;
  const worst = offers.length > 1 ? offers[offers.length - 1] : null;

  return (
    <div className="space-y-5">
      <div>
        <Link href="/" className="text-sm text-accent">
          ← Items
        </Link>
        <div className="mt-2 flex gap-3">
          {product.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.photo_url} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight">{product.name}</h1>
            <p className="text-sm text-muted">
              {product.category}
              {product.notes ? ` · ${product.notes}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="card p-3">
          <div className="text-xs text-muted">Best cost</div>
          <div className="mt-1 font-bold text-accent">{best ? rs(best.unit) : "—"}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-muted">Sell at</div>
          <div className="mt-1 font-bold">{rs(product.retail_price)}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-muted">Profit / pc</div>
          <div
            className={`mt-1 font-bold ${
              best && product.retail_price != null && product.retail_price < best.unit ? "text-bad" : ""
            }`}
          >
            {best && product.retail_price != null
              ? `${rs(product.retail_price - best.unit)} · ${pct(margin(best.unit, product.retail_price))}`
              : "—"}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/add?product=${product.id}`} className="btn btn-primary flex-1">
          + Add price
        </Link>
        <ListQty productId={product.id} qty={listQty} />
      </div>
      <Link href={`/add?product=${product.id}&newshop=1`} className="btn btn-ghost -mt-2 w-full text-sm">
        Found it at a shop that&apos;s not in the list? + New shop
      </Link>

      {/* Shop prices */}
      <section>
        <h2 className="mb-2 font-semibold">Prices by shop</h2>
        {offers.length === 0 && <p className="card p-4 text-sm text-muted">No prices yet. Check a shop and add one.</p>}
        <ul className="space-y-2">
          {offers.map((o, i) => (
            <li key={o.id} className={`card p-3 ${i === 0 ? "border-accent bg-accent-soft" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/shops/${o.shop_id}`} className="font-semibold">
                    {i === 0 && <span className="mr-1 text-accent">★</span>}
                    {o.shop_name}
                  </Link>
                  <p className="text-xs text-muted">
                    {o.street} · checked {shortDate(o.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`text-lg font-bold ${i === 0 ? "text-accent" : ""}`}>{rs(o.unit)}</div>
                  <div className="text-xs text-muted">
                    {o.pack_qty > 1 ? `${rs(o.price)} / ${o.pack_qty} pcs` : "per piece"}
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {i > 0 && best && <span className="text-warn">+{rs(o.unit - best.unit)} vs best</span>}
                {o.prev_unit != null && o.prev_unit !== o.unit && (
                  <span className={o.unit > o.prev_unit ? "text-bad" : "text-accent"}>
                    {o.unit > o.prev_unit ? "▲" : "▼"} was {rs(o.prev_unit)}
                  </span>
                )}
                {o.moq && <span className="text-muted">MOQ: {o.moq}</span>}
                {o.phone && (
                  <a href={`tel:${o.phone}`} className="text-accent">
                    Call
                  </a>
                )}
              </div>
              {o.notes && <p className="mt-1 text-sm">{o.notes}</p>}
              {o.photo_url && (
                <a href={o.photo_url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.photo_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />
                </a>
              )}
            </li>
          ))}
        </ul>
        {worst && best && (
          <p className="mt-2 text-sm text-muted">
            Buying at {best.shop_name} instead of {worst.shop_name} saves {rs(worst.unit - best.unit)} per piece.
          </p>
        )}
      </section>

      {unchecked.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Still to check</h2>
          <ul className="space-y-2">
            {unchecked.map((s) => (
              <li key={s.id} className="card flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <Link href={`/shops/${s.id}`} className="font-medium">
                    {s.name}
                  </Link>
                  <p className="text-xs text-muted">{s.street}</p>
                </div>
                <Link href={`/add?product=${product.id}&shop=${s.id}`} className="btn btn-ghost shrink-0 text-sm">
                  Add price
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 font-semibold">Retail price</h2>
        <RetailPrice productId={product.id} retail={product.retail_price} cost={best?.unit ?? null} />
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Price history</h2>
          <ul className="card divide-y divide-line">
            {history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="truncate">{h.shop_name}</div>
                  <div className="text-xs text-muted">
                    {shortDate(h.created_at)}
                    {h.moq ? ` · MOQ ${h.moq}` : ""}
                    {h.notes ? ` · ${h.notes}` : ""}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span>
                    {rs(h.price)}
                    {h.pack_qty > 1 ? ` / ${h.pack_qty}` : ""}
                  </span>
                  <ConfirmButton action={deletePrice.bind(null, h.id)} message="Delete this price entry?" className="text-muted">
                    ✕
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <ProductDetailsForm product={product} categories={CATEGORIES} />
      </section>
    </div>
  );
}
