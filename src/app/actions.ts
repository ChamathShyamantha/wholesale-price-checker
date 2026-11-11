"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { q } from "@/lib/db";
import { AUTH_COOKIE, authToken } from "@/lib/auth";
import { num, str } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";

function refresh() {
  revalidatePath("/", "layout");
}

function category(v: FormDataEntryValue | null) {
  const c = str(v);
  return c && CATEGORIES.includes(c) ? c : "Other";
}

// ---------- prices ----------

export type AddPriceState = {
  ok: boolean;
  message: string;
  productId?: number;
  shopId?: number;
  at?: number;
};

export async function addPrice(_prev: AddPriceState, form: FormData): Promise<AddPriceState> {
  try {
    let shopId = num(form.get("shop_id"));
    const newShop = str(form.get("new_shop_name"));
    if (!shopId && newShop) {
      const [row] = await q<{ id: number }>(
        `INSERT INTO shops (name, street) VALUES ($1, $2) RETURNING id`,
        [newShop, str(form.get("new_shop_street")) ?? ""],
      );
      shopId = row.id;
    }
    if (!shopId) return { ok: false, message: "Pick a shop" };

    let productId = num(form.get("product_id"));
    const newProduct = str(form.get("new_product_name"));
    const pack = Math.max(1, Math.round(num(form.get("pack_qty")) ?? 1));
    if (!productId && newProduct) {
      const [row] = await q<{ id: number }>(
        `INSERT INTO products (name, category, default_pack) VALUES ($1, $2, $3) RETURNING id`,
        [newProduct, category(form.get("new_product_category")), pack],
      );
      productId = row.id;
    }
    if (!productId) return { ok: false, message: "Pick an item", shopId };

    const price = num(form.get("price"));
    if (price == null || price < 0) return { ok: false, message: "Enter a price", shopId, productId };

    await q(
      `INSERT INTO prices (product_id, shop_id, price, pack_qty, moq, notes, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [productId, shopId, price, pack, str(form.get("moq")), str(form.get("notes")), str(form.get("photo_url"))],
    );
    await q(`INSERT INTO leads (product_id, shop_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [productId, shopId]);
    refresh();
    return { ok: true, message: "Saved", productId, shopId, at: Date.now() };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Something went wrong" };
  }
}

export async function deletePrice(id: number) {
  await q(`DELETE FROM prices WHERE id = $1`, [id]);
  refresh();
}

// ---------- products ----------

export async function updateProduct(form: FormData) {
  const id = num(form.get("id"));
  if (!id) return;
  await q(
    `UPDATE products SET name = COALESCE($2, name), category = $3,
       default_pack = $4, notes = $5, photo_url = $6 WHERE id = $1`,
    [
      id,
      str(form.get("name")),
      category(form.get("category")),
      Math.max(1, Math.round(num(form.get("default_pack")) ?? 1)),
      str(form.get("notes")),
      str(form.get("photo_url")),
    ],
  );
  refresh();
}

export async function setRetailPrice(id: number, retail: number | null) {
  await q(`UPDATE products SET retail_price = $2 WHERE id = $1`, [id, retail]);
  refresh();
}

export async function deleteProduct(id: number) {
  await q(`DELETE FROM products WHERE id = $1`, [id]);
  refresh();
  redirect("/");
}

export async function addLead(productId: number, shopId: number) {
  await q(`INSERT INTO leads (product_id, shop_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [productId, shopId]);
  refresh();
}

export async function removeLead(productId: number, shopId: number) {
  await q(`DELETE FROM leads WHERE product_id = $1 AND shop_id = $2`, [productId, shopId]);
  refresh();
}

// ---------- shops ----------

export async function createShop(form: FormData) {
  const name = str(form.get("name"));
  if (!name) return;
  const [row] = await q<{ id: number }>(
    `INSERT INTO shops (name, street, address, phone, maps_url, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [name, str(form.get("street")) ?? "", str(form.get("address")), str(form.get("phone")), str(form.get("maps_url")), str(form.get("notes"))],
  );
  refresh();
  redirect(`/shops/${row.id}`);
}

export async function updateShop(form: FormData) {
  const id = num(form.get("id"));
  if (!id) return;
  await q(
    `UPDATE shops SET name = COALESCE($2, name), street = $3, address = $4, phone = $5, maps_url = $6, notes = $7
     WHERE id = $1`,
    [id, str(form.get("name")), str(form.get("street")) ?? "", str(form.get("address")), str(form.get("phone")), str(form.get("maps_url")), str(form.get("notes"))],
  );
  refresh();
}

export async function deleteShop(id: number) {
  await q(`DELETE FROM shops WHERE id = $1`, [id]);
  refresh();
  redirect("/shops");
}

// ---------- shopping list ----------

export async function setListQty(productId: number, qty: number) {
  if (qty <= 0) {
    await q(`DELETE FROM list_items WHERE product_id = $1`, [productId]);
  } else {
    await q(
      `INSERT INTO list_items (product_id, qty) VALUES ($1, $2)
       ON CONFLICT (product_id) DO UPDATE SET qty = EXCLUDED.qty`,
      [productId, Math.round(qty)],
    );
  }
  refresh();
}

export async function toggleListDone(id: number, done: boolean) {
  await q(`UPDATE list_items SET done = $2 WHERE id = $1`, [id, done]);
  refresh();
}

export async function clearDone() {
  await q(`DELETE FROM list_items WHERE done`);
  refresh();
}

// ---------- login ----------

export async function login(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const password = process.env.APP_PASSWORD;
  const given = String(form.get("password") ?? "");
  if (password && given !== password) return { error: "Wrong password" };
  if (password) {
    (await cookies()).set(AUTH_COOKIE, await authToken(password), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  const next = String(form.get("next") ?? "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}
