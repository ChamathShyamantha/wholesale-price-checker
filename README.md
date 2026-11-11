# Wholesale Price Checker

A phone-first web app for walking the wholesale shops in Pettah. You record what each shop charges, it shows the cheapest shop for every item, and it works out profit once you set your retail price.

## Features

- **Items:** best price per piece and which shop has it, plus profit and margin. Filter by street, type, "to check", or "no retail price".
- **Add price (quick-add):** the shop stays selected, so you can price item after item. You can enter dozen or pack prices and it works out the per-piece cost. It warns you when another shop is cheaper and shows "New best price!" when you've beaten it.
- **Item page:** every shop's latest price (cheapest starred), price changes since last time, MOQ, notes, photos, shops still to check, full price history, and suggested retail prices for 30/40/50/60% margin.
- **Shops:** grouped by street, with what's still to check there, a call button and a map link.
- **Buy list:** items grouped by their cheapest shop, showing the cash you need, what it sells for, and the profit.
- **Export CSV:** opens in Excel.
- **Help:** a tutorial for every screen in English or Sinhala, with a step-by-step mode.
- **Photos:** of items or price tags, shrunk on the phone before upload.
- **Optional shared password** to keep strangers out.

It starts filled with the items and shops from the original sourcing sheet.

## Deploy on Vercel (free)

1. Go to vercel.com → **Add New → Project** → import this GitHub repo → **Deploy**.
   The first deploy shows a "No database connected" page. That's expected.
2. In the project, open **Storage → Create Database → Neon (Postgres)** and pick the free plan.
   Connect it to this project for all environments. This adds `DATABASE_URL`.
3. In **Storage → Create → Blob**, choose public access and connect it to the project.
   This adds `BLOB_READ_WRITE_TOKEN` and is only needed for photos.
4. Under **Settings → Environment Variables**, add `APP_PASSWORD` with a password you'll share.
   This is optional: without it, anyone with the link can use the app.
5. Go to **Deployments → ⋯ → Redeploy**.

Tables are created and seeded automatically on the first visit.

On your phone, open the site and choose **Add to Home Screen** so it opens like an app.

## Run locally

```bash
npm install
echo DATABASE_URL=pglite > .env.local   # local database in ./.pglite, no account needed
npm run dev
```
