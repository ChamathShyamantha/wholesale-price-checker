"use client";

import Link from "next/link";
import { useActionState, useState, useSyncExternalStore } from "react";
import { addPrice, type AddPriceState } from "@/app/actions";
import Combo from "./Combo";
import PhotoInput from "./PhotoInput";
import { rs } from "@/lib/format";

type P = {
  id: number;
  name: string;
  category: string;
  default_pack: number;
  best_unit: number | null;
  best_shop: string | null;
  best_shop_id: number | null;
};
type S = { id: number; name: string; street: string };

const SHOP_KEY = "wpc_last_shop";
const noop = () => () => {};
function readShop(): number | null {
  try {
    const v = Number(localStorage.getItem(SHOP_KEY));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

export default function AddPriceForm({
  products,
  shops,
  categories,
  initialProductId,
  initialShopId,
  startWithNewShop = false,
}: {
  products: P[];
  shops: S[];
  categories: string[];
  initialProductId: number | null;
  initialShopId: number | null;
  startWithNewShop?: boolean;
}) {
  const [state, action, pending] = useActionState<AddPriceState, FormData>(addPrice, { ok: false, message: "" });

  // Shop: sticky between entries (quick-add mode) and remembered on this phone.
  const savedShop = useSyncExternalStore(noop, readShop, () => null);
  const [shopPick, setShopPick] = useState<number | null | undefined>(initialShopId ?? undefined);
  const shopId = shopPick !== undefined ? shopPick : shops.some((s) => s.id === savedShop) ? savedShop : null;
  const [newShop, setNewShop] = useState<{ name: string; street: string } | null>(
    startWithNewShop ? { name: "", street: "" } : null,
  );

  const [productId, setProductId] = useState<number | null>(initialProductId);
  const [newProduct, setNewProduct] = useState<{ name: string; category: string } | null>(null);
  const product = products.find((p) => p.id === productId) ?? null;

  const [price, setPrice] = useState("");
  const [pack, setPack] = useState(String(product?.default_pack ?? 1));
  const [moq, setMoq] = useState("");
  const [notes, setNotes] = useState("");
  const [more, setMore] = useState(false);

  // After a successful save: keep the shop, clear the rest for the next item.
  const [lastAt, setLastAt] = useState<number | undefined>(undefined);
  if (state.ok && state.at !== lastAt) {
    setLastAt(state.at);
    setShopPick(state.shopId ?? null);
    setNewShop(null);
    setProductId(null);
    setNewProduct(null);
    setPrice("");
    setPack("1");
    setMoq("");
    setNotes("");
    try {
      if (state.shopId) localStorage.setItem(SHOP_KEY, String(state.shopId));
    } catch {}
  }

  const pickShop = (id: number | null) => {
    setShopPick(id);
    setNewShop(null);
    try {
      if (id) localStorage.setItem(SHOP_KEY, String(id));
    } catch {}
  };

  const pickProduct = (id: number | null) => {
    setProductId(id);
    setNewProduct(null);
    const p = products.find((x) => x.id === id);
    if (p) setPack(String(p.default_pack));
  };

  const priceNum = Number(price.replace(/,/g, ""));
  const packNum = Math.max(1, Math.round(Number(pack) || 1));
  const unit = price && Number.isFinite(priceNum) ? priceNum / packNum : null;
  const streets = [...new Set(shops.map((s) => s.street).filter(Boolean))].sort();

  let compare: { tone: "good" | "warn" | "info"; text: string } | null = null;
  if (unit != null && product?.best_unit != null) {
    const best = product.best_unit;
    if (product.best_shop_id === shopId) {
      compare = { tone: "info", text: `This shop is the current cheapest (${rs(best)}/pc).` };
    } else if (unit > best) {
      compare = { tone: "warn", text: `${product.best_shop} is cheaper: ${rs(best)}/pc (${rs(unit - best)} less per piece).` };
    } else if (unit < best) {
      compare = { tone: "good", text: `New best price! ${rs(best - unit)}/pc cheaper than ${product.best_shop}.` };
    } else {
      compare = { tone: "info", text: `Same as ${product.best_shop} (${rs(best)}/pc).` };
    }
  }

  const savedProduct = state.ok ? products.find((p) => p.id === state.productId) : null;

  return (
    <form action={action} className="space-y-5">
      {state.ok && (
        <div className="card flex items-center justify-between gap-3 border-accent bg-accent-soft p-3 text-sm">
          <span>✓ Saved{savedProduct ? `: ${savedProduct.name}` : ""}</span>
          {state.productId && (
            <Link href={`/products/${state.productId}`} className="font-semibold text-accent">
              View
            </Link>
          )}
        </div>
      )}
      {!state.ok && state.message && <div className="card border-bad p-3 text-sm text-bad">{state.message}</div>}

      {/* Shop */}
      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold">Shop</label>
          {!newShop && (
            <button type="button" className="text-sm font-semibold text-accent" onClick={() => setNewShop({ name: "", street: "" })}>
              + New shop
            </button>
          )}
        </div>
        {newShop ? (
          <div className="card space-y-2 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">New shop</span>
              <button type="button" className="text-sm text-accent" onClick={() => setNewShop(null)}>
                Cancel
              </button>
            </div>
            <input
              className="field"
              name="new_shop_name"
              placeholder="Shop name"
              autoFocus
              required
              value={newShop.name}
              onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
            />
            <input
              className="field"
              name="new_shop_street"
              placeholder="Street (e.g. 2nd Cross St)"
              list="streets"
              value={newShop.street}
              onChange={(e) => setNewShop({ ...newShop, street: e.target.value })}
            />
            <datalist id="streets">
              {streets.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        ) : (
          <>
            <input type="hidden" name="shop_id" value={shopId ?? ""} />
            <Combo
              options={shops.map((s) => ({ id: s.id, label: s.name, hint: s.street }))}
              value={shopId}
              onChange={pickShop}
              onCreate={(name) => setNewShop({ name, street: "" })}
              placeholder="Search shop…"
              createLabel="New shop"
            />
          </>
        )}
      </section>

      {/* Item */}
      <section>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold">Item</label>
          {!newProduct && (
            <button type="button" className="text-sm font-semibold text-accent" onClick={() => setNewProduct({ name: "", category: "Other" })}>
              + New item
            </button>
          )}
        </div>
        {newProduct ? (
          <div className="card space-y-2 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">New item</span>
              <button type="button" className="text-sm text-accent" onClick={() => setNewProduct(null)}>
                Cancel
              </button>
            </div>
            <input
              className="field"
              name="new_product_name"
              placeholder="Item name"
              autoFocus
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <select
              className="field"
              name="new_product_category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <input type="hidden" name="product_id" value={productId ?? ""} />
            <Combo
              key={`product-${lastAt ?? 0}`}
              options={products.map((p) => ({
                id: p.id,
                label: p.name,
                hint: p.best_unit != null ? `Best ${rs(p.best_unit)}/pc · ${p.best_shop}` : `${p.category} · not priced`,
              }))}
              value={productId}
              onChange={pickProduct}
              onCreate={(name) => setNewProduct({ name, category: "Other" })}
              placeholder="Search item…"
              createLabel="New item"
            />
          </>
        )}
      </section>

      {/* Price */}
      <section>
        <label className="mb-1.5 block text-sm font-semibold">Wholesale price (Rs)</label>
        <div className="flex gap-2">
          <input
            className="field text-2xl font-bold"
            name="price"
            inputMode="decimal"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">for</span>
          <button type="button" className="chip" data-on={packNum === 1} onClick={() => setPack("1")}>
            1 piece
          </button>
          <button type="button" className="chip" data-on={packNum === 12} onClick={() => setPack("12")}>
            Dozen
          </button>
          <span className="flex items-center gap-1">
            <input
              className="field w-20 py-1.5 text-center"
              name="pack_qty"
              inputMode="numeric"
              value={pack}
              onChange={(e) => setPack(e.target.value.replace(/\D/g, ""))}
            />
            <span className="text-muted">pcs</span>
          </span>
        </div>
        {unit != null && packNum > 1 && <p className="mt-2 text-sm">= {rs(unit)} per piece</p>}
        {compare && (
          <p
            className={`mt-2 rounded-lg p-2.5 text-sm ${
              compare.tone === "good" ? "bg-accent-soft text-accent" : compare.tone === "warn" ? "bg-warn-soft text-warn" : "bg-bg text-muted"
            }`}
          >
            {compare.text}
          </p>
        )}
      </section>

      <section>
        <button type="button" className="text-sm font-medium text-accent" onClick={() => setMore(!more)}>
          {more ? "− Hide extras" : "+ MOQ, note, photo"}
        </button>
        <div className={more ? "mt-3 space-y-3" : "hidden"}>
          <input
            className="field"
            name="moq"
            placeholder="Minimum order (e.g. 1 dozen, 10 boxes)"
            value={moq}
            onChange={(e) => setMoq(e.target.value)}
          />
          <textarea
            className="field"
            name="notes"
            rows={2}
            placeholder="Note (quality, bargain, colours…)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <PhotoInput label="Photo" resetKey={state.at} />
        </div>
      </section>

      <button type="submit" disabled={pending} className="btn btn-primary w-full text-lg">
        {pending ? "Saving…" : "Save price"}
      </button>
    </form>
  );
}
