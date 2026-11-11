"use client";

import { useState, useTransition } from "react";
import { deleteProduct, updateProduct } from "@/app/actions";
import type { Product } from "@/lib/queries";
import PhotoInput from "./PhotoInput";

export default function ProductDetailsForm({ product, categories }: { product: Product; categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  if (!open) {
    return (
      <button type="button" className="btn btn-ghost w-full" onClick={() => setOpen(true)}>
        Edit item details
      </button>
    );
  }

  return (
    <form
      className="card space-y-3 p-3"
      action={(fd) =>
        start(async () => {
          await updateProduct(fd);
          setSaved(true);
        })
      }
    >
      <input type="hidden" name="id" value={product.id} />
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Name</span>
        <input className="field" name="name" defaultValue={product.name} required />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Type</span>
          <select className="field" name="category" defaultValue={product.category}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Usually sold per</span>
          <input className="field" name="default_pack" inputMode="numeric" defaultValue={product.default_pack} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Notes</span>
        <textarea className="field" name="notes" rows={2} defaultValue={product.notes ?? ""} />
      </label>
      <PhotoInput label="Item photo" initial={product.photo_url} />
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
          if (confirm(`Delete "${product.name}" and all its prices?`)) start(() => deleteProduct(product.id));
        }}
      >
        Delete item
      </button>
    </form>
  );
}
