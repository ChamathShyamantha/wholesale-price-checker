"use client";

import { useState } from "react";

export type ComboOption = { id: number; label: string; hint?: string };

/** Search-as-you-type picker with a "create new" option. */
export default function Combo({
  options,
  value,
  onChange,
  onCreate,
  placeholder,
  createLabel = "Add new",
}: {
  options: ComboOption[];
  value: number | null;
  onChange: (id: number | null) => void;
  onCreate: (text: string) => void;
  placeholder: string;
  createLabel?: string;
}) {
  const selected = options.find((o) => o.id === value) ?? null;
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  if (selected && !open) {
    return (
      <button
        type="button"
        className="field flex items-center justify-between text-left"
        onClick={() => {
          setText("");
          setOpen(true);
        }}
      >
        <span className="min-w-0">
          <span className="block truncate font-medium">{selected.label}</span>
          {selected.hint && <span className="block truncate text-xs text-muted">{selected.hint}</span>}
        </span>
        <span className="ml-2 shrink-0 text-sm text-accent">Change</span>
      </button>
    );
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = options
    .filter((o) => {
      const hay = (o.label + " " + (o.hint ?? "")).toLowerCase();
      return words.every((w) => hay.includes(w));
    })
    .slice(0, 30);
  const exact = options.some((o) => o.label.toLowerCase() === text.trim().toLowerCase());

  return (
    <div>
      <input
        className="field"
        autoFocus={open}
        placeholder={placeholder}
        value={text}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
      />
      {open && (
        <div className="card mt-1 max-h-72 overflow-y-auto">
          {text.trim() && !exact && (
            <button
              type="button"
              className="block w-full border-b border-line px-3 py-3 text-left font-medium text-accent"
              onClick={() => {
                onCreate(text.trim());
                setOpen(false);
              }}
            >
              + {createLabel} “{text.trim()}”
            </button>
          )}
          {matches.map((o) => (
            <button
              type="button"
              key={o.id}
              className="block w-full border-b border-line px-3 py-2.5 text-left last:border-0 active:bg-bg"
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
            >
              <span className="block">{o.label}</span>
              {o.hint && <span className="block text-xs text-muted">{o.hint}</span>}
            </button>
          ))}
          {matches.length === 0 && !text.trim() && <p className="px-3 py-3 text-sm text-muted">Nothing yet</p>}
          {selected && (
            <button type="button" className="block w-full px-3 py-2.5 text-left text-sm text-muted" onClick={() => setOpen(false)}>
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
