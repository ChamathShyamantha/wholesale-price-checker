import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mt-10 p-6 text-center">
      <div className="text-4xl" aria-hidden>
        🔎
      </div>
      <h1 className="mt-2 text-lg font-bold">Not found</h1>
      <p className="mt-1 text-sm text-muted">This item or shop may have been deleted. · මෙය මකා දමා ඇති විය හැක.</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link href="/" className="btn btn-primary">
          Items
        </Link>
        <Link href="/shops" className="btn btn-ghost">
          Shops
        </Link>
      </div>
    </div>
  );
}
