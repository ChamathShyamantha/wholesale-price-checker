import type { ShopRow } from "@/lib/queries";
import PhotoInput from "./PhotoInput";

export default function ShopFields({ shop, streets }: { shop?: ShopRow; streets: string[] }) {
  return (
    <>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Shop name</span>
        <input className="field" name="name" defaultValue={shop?.name} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Street / area</span>
        <input className="field" name="street" list="shop-streets" defaultValue={shop?.street} placeholder="e.g. Prince Street" />
        <datalist id="shop-streets">
          {streets.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Address</span>
        <input className="field" name="address" defaultValue={shop?.address ?? ""} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Phone</span>
          <input className="field" name="phone" type="tel" defaultValue={shop?.phone ?? ""} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Google Maps link</span>
          <input className="field" name="maps_url" type="url" defaultValue={shop?.maps_url ?? ""} placeholder="https://maps…" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Notes</span>
        <textarea
          className="field"
          name="notes"
          rows={2}
          defaultValue={shop?.notes ?? ""}
          placeholder="Opening hours, bargains?, card ok?, contact person…"
        />
      </label>
      <div className="text-sm">
        <span className="mb-1 block font-medium">Shop photo</span>
        <PhotoInput label="Shop photo" initial={shop?.photo_url ?? null} />
        <p className="mt-1 text-xs text-muted">A photo of the shop front or sign, so you can find it again.</p>
      </div>
    </>
  );
}
