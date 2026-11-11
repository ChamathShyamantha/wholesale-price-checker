"use client";

import { useTransition } from "react";

export default function ConfirmButton({
  action,
  message,
  className = "",
  children,
}: {
  action: () => Promise<void>;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={`min-h-8 min-w-8 ${className}`}
      onClick={() => {
        if (confirm(message)) start(() => action());
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
