"use client";

import { useState } from "react";
import { createShop } from "@/app/actions";
import ShopFields from "./ShopFields";

export default function NewShopForm({ streets }: { streets: string[] }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="btn btn-ghost w-full" onClick={() => setOpen(true)}>
        + New shop
      </button>
    );
  }
  return (
    <form action={createShop} className="card space-y-3 p-3">
      <ShopFields streets={streets} />
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          Create shop
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
