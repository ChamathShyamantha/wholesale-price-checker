import { connection } from "next/server";
import { listProducts } from "@/lib/queries";
import ProductList from "@/components/ProductList";
import DbError from "@/components/DbError";
import FirstVisitHint from "@/components/FirstVisitHint";

export default async function Home() {
  await connection();
  let products;
  try {
    products = await listProducts();
  } catch (e) {
    return <DbError error={e} />;
  }
  const priced = products.filter((p) => p.priced_count > 0).length;

  return (
    <>
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-sm text-muted">
            {products.length} items · {priced} priced · {products.length - priced} to check
          </p>
        </div>
        <a href="/api/export" className="btn btn-ghost text-sm">
          Export CSV
        </a>
      </header>
      <FirstVisitHint />
      <ProductList products={products} />
    </>
  );
}
