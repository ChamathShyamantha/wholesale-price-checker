import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/";
  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight">Price Checker</h1>
      <p className="mb-6 text-sm text-muted">Enter the shared password.</p>
      <LoginForm next={next} />
    </div>
  );
}
