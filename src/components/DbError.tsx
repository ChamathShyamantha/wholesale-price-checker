export default function DbError({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="card mt-6 p-5">
      <h1 className="text-lg font-bold">Can&apos;t reach the database</h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
}
