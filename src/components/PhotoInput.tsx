"use client";

import { useRef, useState } from "react";

/** Shrinks a photo on the phone before upload so it's fast on mobile data. */
async function compress(file: File, max = 1280, quality = 0.72): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read photo"))), "image/jpeg", quality),
  );
}

export default function PhotoInput({
  name = "photo_url",
  initial = null,
  label = "Photo",
  resetKey,
}: {
  name?: string;
  initial?: string | null;
  label?: string;
  resetKey?: unknown;
}) {
  const [url, setUrl] = useState<string | null>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastReset, setLastReset] = useState(resetKey);
  if (resetKey !== lastReset) {
    setLastReset(resetKey);
    setUrl(initial);
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await compress(file);
      const body = new FormData();
      body.append("file", new File([blob], "photo.jpg", { type: "image/jpeg" }));
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
        )}
        <button type="button" className="btn btn-ghost text-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Uploading…" : url ? `Change ${label.toLowerCase()}` : `📷 ${label}`}
        </button>
        {url && !busy && (
          <button type="button" className="text-sm text-muted underline" onClick={() => setUrl(null)}>
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-bad">{error}</p>}
    </div>
  );
}
