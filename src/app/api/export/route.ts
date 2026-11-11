import { exportRows } from "@/lib/queries";

function cell(v: unknown): string {
  if (v == null) return "";
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const rows = await exportRows();
  const header = [
    "Item",
    "Category",
    "Shop",
    "Street",
    "Wholesale price",
    "Pieces for that price",
    "Price per piece",
    "MOQ",
    "Retail price",
    "Profit per piece",
    "Cheapest?",
    "Checked on",
  ];
  const lines = rows.map((r) =>
    [
      r.product,
      r.category,
      r.shop,
      r.street,
      r.price,
      r.pack_qty,
      r.unit != null ? Math.round(r.unit * 100) / 100 : null,
      r.moq,
      r.retail_price,
      r.unit != null && r.retail_price != null ? Math.round((r.retail_price - r.unit) * 100) / 100 : null,
      r.is_best ? "YES" : "",
      r.checked_at,
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="wholesale-prices-${date}.csv"`,
    },
  });
}
