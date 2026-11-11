import { NextResponse } from "next/server";
import { q } from "@/lib/db";

// Tour helper: opens the item with the most shop prices, so the tour has something to show.
export async function GET(request: Request) {
  const [row] = await q<{ id: number }>(`
    SELECT p.id FROM products p
    ORDER BY (SELECT count(DISTINCT shop_id) FROM prices pr WHERE pr.product_id = p.id) DESC, p.id
    LIMIT 1`);
  return NextResponse.redirect(new URL(row ? `/products/${row.id}` : "/", request.url));
}
