import { NextResponse } from "next/server";
import { q } from "@/lib/db";

// Tour helper: opens the shop with the most items, so the tour has something to show.
export async function GET(request: Request) {
  const [row] = await q<{ id: number }>(`
    SELECT s.id FROM shops s
    ORDER BY (SELECT count(*) FROM leads l WHERE l.shop_id = s.id) DESC, s.id
    LIMIT 1`);
  return NextResponse.redirect(new URL(row ? `/shops/${row.id}` : "/shops", request.url));
}
