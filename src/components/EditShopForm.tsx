"use client";

import { useState, useTransition } from "react";
import { deleteShop, updateShop } from "@/app/actions";
import type { ShopRow } from "@/lib/queries";
import ShopFields from "./ShopFields";

export default function EditShopForm({ shop, streets }: { shop: ShopRow; streets: string[] }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  if (!open) {
    return (
      <button type="button" className="btn btn-ghost w-full" onClick={() => setOpen(true)}>
        Edit shop details
      </button>
    );
  }
  return (
    <form
      className="card space-y-3 p-3"
      action={(fd) =>
        start(async () => {
          await updateShop(fd);
          setSaved(true);
        })
      }
    >
      <input type="hidden" name="id" value={shop.id} />
      <ShopFields shop={shop} streets={streets} />
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1" disabled={pending}>
          {pending ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <button
        type="button"
        className="w-full pt-2 text-sm text-bad"
        onClick={() => {
          if (confirm(`Delete "${shop.name}" and all prices recorded there?`)) start(() => deleteShop(shop.id));
        }}
      >
        Delete shop
      </button>
    </form>
  );
}
