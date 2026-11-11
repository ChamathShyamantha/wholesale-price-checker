import { connection } from "next/server";
import { latestOffers, listProducts, shopOptions } from "@/lib/queries";
import { CATEGORIES } from "@/lib/seed";
import AddPriceForm from "@/components/AddPriceForm";
import DbError from "@/components/DbError";

export default async function AddPage({ searchParams }: PageProps<"/add">) {
  await connection();
  const sp = await searchParams;
  let products, shops, offers;
  try {
    [products, shops, offers] = await Promise.all([listProducts(), shopOptions(), latestOffers()]);
  } catch (e) {
    return <DbError error={e} />;
  }
  const initialProductId = Number(sp.product) || null;
  const initialShopId = Number(sp.shop) || null;

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Add price</h1>
      <p className="mb-5 text-sm text-muted">The shop stays selected, so you can add items one after another.</p>
      <AddPriceForm
        products={products.map(({ id, name, category, default_pack, best_unit, best_shop, best_shop_id }) => ({
          id,
          name,
          category,
          default_pack,
          best_unit,
          best_shop,
          best_shop_id,
        }))}
        shops={shops}
        categories={CATEGORIES}
        initialProductId={initialProductId}
        initialShopId={initialShopId}
        startWithNewShop={sp.newshop === "1"}
        offers={offers}
      />
    </>
  );
}
