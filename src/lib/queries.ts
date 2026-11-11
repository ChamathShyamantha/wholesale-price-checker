import "server-only";
import { q } from "./db";

// Latest price per (product, shop), with per-piece unit cost.
const LATEST = `latest AS (
  SELECT DISTINCT ON (product_id, shop_id)
    id, product_id, shop_id, price::float8 AS price, pack_qty,
    price::float8 / pack_qty AS unit, moq, notes, photo_url, created_at
  FROM prices
  ORDER BY product_id, shop_id, created_at DESC, id DESC
)`;

const BEST = `best AS (
  SELECT DISTINCT ON (l.product_id)
    l.product_id, l.unit, l.price, l.pack_qty, l.moq, l.shop_id,
    s.name AS shop_name, s.street
  FROM latest l JOIN shops s ON s.id = l.shop_id
  ORDER BY l.product_id, l.unit ASC
)`;

const LINKS = `links AS (
  SELECT product_id, shop_id FROM leads
  UNION
  SELECT product_id, shop_id FROM prices
)`;

export type ProductRow = {
  id: number;
  name: string;
  category: string;
  retail_price: number | null;
  default_pack: number;
  notes: string | null;
  photo_url: string | null;
  best_unit: number | null;
  best_shop: string | null;
  best_shop_id: number | null;
  priced_count: number;
  shop_count: number;
  streets: string[];
  on_list: boolean;
};

export async function listProducts(): Promise<ProductRow[]> {
  return q<ProductRow>(`
    WITH ${LATEST}, ${BEST}, ${LINKS}
    SELECT p.id, p.name, p.category, p.retail_price::float8 AS retail_price, p.default_pack,
      p.notes, p.photo_url,
      b.unit AS best_unit, b.shop_name AS best_shop, b.shop_id AS best_shop_id,
      (SELECT count(*)::int FROM latest l WHERE l.product_id = p.id) AS priced_count,
      (SELECT count(*)::int FROM links k WHERE k.product_id = p.id) AS shop_count,
      COALESCE((SELECT array_agg(DISTINCT s.street) FROM links k JOIN shops s ON s.id = k.shop_id
                WHERE k.product_id = p.id), '{}') AS streets,
      EXISTS (SELECT 1 FROM list_items li WHERE li.product_id = p.id) AS on_list
    FROM products p LEFT JOIN best b ON b.product_id = p.id
    ORDER BY p.category, p.name`);
}

export type Product = {
  id: number;
  name: string;
  category: string;
  retail_price: number | null;
  default_pack: number;
  notes: string | null;
  photo_url: string | null;
};

export type Offer = {
  id: number;
  shop_id: number;
  shop_name: string;
  street: string;
  phone: string | null;
  price: number;
  pack_qty: number;
  unit: number;
  moq: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: Date;
  prev_unit: number | null;
};

export type HistoryRow = {
  id: number;
  shop_name: string;
  price: number;
  pack_qty: number;
  moq: string | null;
  notes: string | null;
  created_at: Date;
};

export async function getProduct(id: number) {
  const [product] = await q<Product>(
    `SELECT id, name, category, retail_price::float8 AS retail_price, default_pack, notes, photo_url
     FROM products WHERE id = $1`,
    [id],
  );
  if (!product) return null;
  const [offers, unchecked, history, listRows] = await Promise.all([
    q<Offer>(
      `WITH ranked AS (
         SELECT pr.*, row_number() OVER (PARTITION BY shop_id ORDER BY created_at DESC, id DESC) AS rn
         FROM prices pr WHERE product_id = $1
       )
       SELECT r.id, r.shop_id, s.name AS shop_name, s.street, s.phone, r.price::float8 AS price, r.pack_qty,
         r.price::float8 / r.pack_qty AS unit, r.moq, r.notes, r.photo_url, r.created_at,
         (SELECT r2.price::float8 / r2.pack_qty FROM ranked r2 WHERE r2.shop_id = r.shop_id AND r2.rn = 2) AS prev_unit
       FROM ranked r JOIN shops s ON s.id = r.shop_id
       WHERE r.rn = 1
       ORDER BY unit ASC`,
      [id],
    ),
    q<{ id: number; name: string; street: string }>(
      `SELECT s.id, s.name, s.street FROM leads l JOIN shops s ON s.id = l.shop_id
       WHERE l.product_id = $1
         AND NOT EXISTS (SELECT 1 FROM prices pr WHERE pr.product_id = $1 AND pr.shop_id = s.id)
       ORDER BY s.street, s.name`,
      [id],
    ),
    q<HistoryRow>(
      `SELECT pr.id, s.name AS shop_name, pr.price::float8 AS price, pr.pack_qty, pr.moq, pr.notes, pr.created_at
       FROM prices pr JOIN shops s ON s.id = pr.shop_id
       WHERE pr.product_id = $1 ORDER BY pr.created_at DESC, pr.id DESC LIMIT 100`,
      [id],
    ),
    q<{ qty: number }>(`SELECT qty FROM list_items WHERE product_id = $1`, [id]),
  ]);
  return { product, offers, unchecked, history, listQty: listRows[0]?.qty ?? null };
}

export type ShopRow = {
  id: number;
  name: string;
  street: string;
  address: string | null;
  phone: string | null;
  maps_url: string | null;
  notes: string | null;
  item_count: number;
  priced_count: number;
};

export async function listShops(): Promise<ShopRow[]> {
  return q<ShopRow>(`
    WITH ${LINKS}
    SELECT s.id, s.name, s.street, s.address, s.phone, s.maps_url, s.notes,
      (SELECT count(*)::int FROM links k WHERE k.shop_id = s.id) AS item_count,
      (SELECT count(DISTINCT pr.product_id)::int FROM prices pr WHERE pr.shop_id = s.id) AS priced_count
    FROM shops s ORDER BY s.street, s.name`);
}

export type ShopItem = {
  id: number;
  name: string;
  category: string;
  retail_price: number | null;
  here_unit: number | null;
  here_price: number | null;
  here_pack: number | null;
  here_moq: string | null;
  here_date: Date | null;
  best_unit: number | null;
  best_shop: string | null;
};

export async function getShop(id: number) {
  const [shop] = await q<ShopRow>(
    `SELECT id, name, street, address, phone, maps_url, notes, 0 AS item_count, 0 AS priced_count
     FROM shops WHERE id = $1`,
    [id],
  );
  if (!shop) return null;
  const items = await q<ShopItem>(
    `WITH ${LATEST}, ${BEST},
     mine AS (SELECT product_id FROM leads WHERE shop_id = $1 UNION SELECT product_id FROM prices WHERE shop_id = $1)
     SELECT p.id, p.name, p.category, p.retail_price::float8 AS retail_price,
       h.unit AS here_unit, h.price AS here_price, h.pack_qty AS here_pack, h.moq AS here_moq, h.created_at AS here_date,
       b.unit AS best_unit, b.shop_name AS best_shop
     FROM mine m JOIN products p ON p.id = m.product_id
     LEFT JOIN latest h ON h.product_id = p.id AND h.shop_id = $1
     LEFT JOIN best b ON b.product_id = p.id
     ORDER BY (h.unit IS NULL) DESC, p.name`,
    [id],
  );
  return { shop, items };
}

export type ListRow = {
  id: number;
  qty: number;
  done: boolean;
  product_id: number;
  name: string;
  retail_price: number | null;
  default_pack: number;
  unit: number | null;
  price: number | null;
  pack_qty: number | null;
  moq: string | null;
  shop_id: number | null;
  shop_name: string | null;
  street: string | null;
};

export async function getList(): Promise<ListRow[]> {
  return q<ListRow>(`
    WITH ${LATEST}, ${BEST}
    SELECT li.id, li.qty, li.done, p.id AS product_id, p.name, p.retail_price::float8 AS retail_price, p.default_pack,
      b.unit, b.price, b.pack_qty, b.moq, b.shop_id, b.shop_name, b.street
    FROM list_items li JOIN products p ON p.id = li.product_id
    LEFT JOIN best b ON b.product_id = p.id
    ORDER BY b.street NULLS LAST, b.shop_name NULLS LAST, p.name`);
}

export type ExportRow = {
  product: string;
  category: string;
  shop: string | null;
  street: string | null;
  price: number | null;
  pack_qty: number | null;
  unit: number | null;
  moq: string | null;
  retail_price: number | null;
  is_best: boolean | null;
  checked_at: Date | null;
};

export async function exportRows(): Promise<ExportRow[]> {
  return q<ExportRow>(`
    WITH ${LATEST}, ${BEST}, ${LINKS}
    SELECT p.name AS product, p.category, s.name AS shop, s.street, l.price, l.pack_qty, l.unit, l.moq,
      p.retail_price::float8 AS retail_price,
      (b.shop_id = s.id) AS is_best, l.created_at AS checked_at
    FROM products p
    LEFT JOIN links k ON k.product_id = p.id
    LEFT JOIN shops s ON s.id = k.shop_id
    LEFT JOIN latest l ON l.product_id = p.id AND l.shop_id = s.id
    LEFT JOIN best b ON b.product_id = p.id
    ORDER BY p.category, p.name, l.unit NULLS LAST`);
}

export type LatestOffer = { product_id: number; shop_id: number; shop_name: string; unit: number };

/** Latest price per piece for every (item, shop) pair, for comparisons while adding a price. */
export async function latestOffers(): Promise<LatestOffer[]> {
  return q<LatestOffer>(`
    WITH ${LATEST}
    SELECT l.product_id, l.shop_id, s.name AS shop_name, l.unit
    FROM latest l JOIN shops s ON s.id = l.shop_id`);
}

export async function shopOptions() {
  return q<{ id: number; name: string; street: string }>(`SELECT id, name, street FROM shops ORDER BY name`);
}
