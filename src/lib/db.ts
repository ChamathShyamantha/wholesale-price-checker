import { neon } from "@neondatabase/serverless";
import { SEED_LEADS, SEED_PRODUCTS, SEED_SHOPS } from "./seed";

type Stmt = { text: string; params?: unknown[] };
type Runner = {
  query(text: string, params: unknown[]): Promise<unknown[]>;
  /** Run statements atomically, in order. */
  batch(stmts: Stmt[]): Promise<void>;
};

let runner: Promise<Runner> | null = null;

async function createRunner(): Promise<Runner> {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "No database connected. In Vercel: Storage → Create → Neon (Postgres), connect it to this project, then redeploy.",
    );
  }

  // Local development without Neon: DATABASE_URL=pglite (data kept in ./.pglite).
  if (url === "pglite" && process.env.NODE_ENV !== "production") {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite("./.pglite");
    return {
      query: async (text, params) => (await pg.query(text, params)).rows,
      batch: async (stmts) => {
        await pg.transaction(async (tx) => {
          for (const s of stmts) await tx.query(s.text, s.params ?? []);
        });
      },
    };
  }

  const sql = neon(url);
  return {
    query: async (text, params) => (await sql.query(text, params)) as unknown[],
    batch: async (stmts) => {
      await sql.transaction(stmts.map((s) => sql.query(s.text, s.params ?? [])));
    },
  };
}

function getRunner() {
  if (!runner) {
    runner = createRunner().catch((e) => {
      runner = null;
      throw e;
    });
  }
  return runner;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS app_meta (key text PRIMARY KEY, value text)`,
  `CREATE TABLE IF NOT EXISTS shops (
    id serial PRIMARY KEY,
    name text NOT NULL,
    street text NOT NULL DEFAULT '',
    address text,
    phone text,
    maps_url text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL DEFAULT 'Other',
    retail_price numeric,
    default_pack int NOT NULL DEFAULT 1,
    notes text,
    photo_url text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS prices (
    id serial PRIMARY KEY,
    product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    shop_id int NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    price numeric NOT NULL,
    pack_qty int NOT NULL DEFAULT 1,
    moq text,
    notes text,
    photo_url text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS prices_product_shop ON prices (product_id, shop_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS leads (
    product_id int NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    shop_id int NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, shop_id)
  )`,
  `CREATE TABLE IF NOT EXISTS list_items (
    id serial PRIMARY KEY,
    product_id int NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    qty int NOT NULL DEFAULT 1,
    done boolean NOT NULL DEFAULT false
  )`,
];

const NOT_SEEDED = `NOT EXISTS (SELECT 1 FROM app_meta WHERE key = 'seeded')`;

async function setup() {
  const db = await getRunner();
  const seedProducts = SEED_PRODUCTS.map(({ name, category, pack, notes }) => ({
    name,
    category,
    pack: pack ?? 1,
    notes: notes ?? "",
  }));
  // One transaction, guarded by an advisory lock, so two cold starts can't seed twice.
  await db.batch([
    { text: `SELECT pg_advisory_xact_lock(424242)` },
    ...SCHEMA.map((text) => ({ text })),
    {
      text: `INSERT INTO shops (name, street, address)
       SELECT x->>'name', x->>'street', NULLIF(x->>'address', '')
       FROM jsonb_array_elements($1::jsonb) x WHERE ${NOT_SEEDED}`,
      params: [JSON.stringify(SEED_SHOPS)],
    },
    {
      text: `INSERT INTO products (name, category, default_pack, notes)
       SELECT x->>'name', x->>'category', (x->>'pack')::int, NULLIF(x->>'notes', '')
       FROM jsonb_array_elements($1::jsonb) x WHERE ${NOT_SEEDED}`,
      params: [JSON.stringify(seedProducts)],
    },
    {
      text: `INSERT INTO leads (product_id, shop_id)
       SELECT p.id, s.id FROM jsonb_array_elements($1::jsonb) x
       JOIN products p ON p.name = x->>'p'
       JOIN shops s ON s.name = x->>'s'
       WHERE ${NOT_SEEDED}
       ON CONFLICT DO NOTHING`,
      params: [JSON.stringify(SEED_LEADS)],
    },
    { text: `INSERT INTO app_meta (key, value) VALUES ('seeded', now()::text) ON CONFLICT DO NOTHING` },
  ]);
}

let ready: Promise<void> | null = null;

function ensureReady() {
  if (!ready) {
    ready = setup().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

/** Run a parameterised query and return rows. */
export async function q<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureReady();
  const db = await getRunner();
  return (await db.query(text, params)) as T[];
}
