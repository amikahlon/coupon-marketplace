# Coupon Marketplace

A backend system for a digital marketplace that sells coupon-based products
through two channels:

- **Direct customers** — buy from the web frontend at a fixed price.
- **External resellers** — integrate via a secure REST API and resell at their
  own price (as long as it is at or above the minimum).

## Tech stack

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Validation:** Zod
- **Frontend:** React (Vite)
- **Docs:** Swagger UI (OpenAPI)
- **Infrastructure:** Docker + Docker Compose

## What you need

Only **Docker Desktop** (which includes Docker Compose). No Node, no Postgres.

## Run everything with one command

From the project root:

```bash
docker compose up --build
```

That single command starts everything: the database, runs migrations, seeds
sample coupons, starts the backend API, Prisma Studio, and the frontend.

When you see `Server running on http://localhost:4000`, it's ready.

To stop: `Ctrl+C`, then `docker compose down` (add `-v` to wipe the database).

## Where everything runs

| What                        | URL                            |
| --------------------------- | ------------------------------ |
| Frontend (Customer + Admin) | http://localhost:5173          |
| Backend API                 | http://localhost:4000          |
| API docs (Swagger UI)       | http://localhost:4000/api/docs |
| Prisma Studio (DB browser)  | http://localhost:5555          |
| PostgreSQL                  | localhost:5432                 |

## Tokens

- **Reseller token:** `reseller-dev-token-change-me`
- **Admin token:** `admin-dev-token-change-me`

Send as a header: `Authorization: Bearer <token>`.
The customer (storefront) API is public and needs no token.

## How to test (Swagger — easiest)

1. Open http://localhost:4000/api/docs
2. Click **Authorize** and paste a token (reseller for reseller endpoints;
   Logout and paste the admin token for admin endpoints).
3. Expand an endpoint → **Try it out** → **Execute**.

Worth trying:

- `GET /api/v1/products` without a token → **401**.
- `GET /api/v1/products` (reseller) → list with **no** cost/margin/value.
- Purchase with `{"reseller_price": 50}` on the Amazon coupon (min 100) → **400**.
- Purchase with `{"reseller_price": 120}` → **200** and the value is revealed.
- Repeat → **409** (already sold).
- `GET /api/admin/products` (admin) → full data including cost/margin/value.

## Key design decisions

- **Server-side pricing.** `minimum_sell_price = cost_price × (1 + margin/100)`
  is computed on the server and never stored. Cost and margin are never taken
  from client input.
- **Hidden fields.** Cost, margin, and the coupon value are never returned by
  the public APIs; the value is revealed only after a successful purchase.
- **Atomic purchase.** Marking sold uses a single conditional SQL update, so two
  buyers racing for one coupon can't both succeed (the loser gets 409).
- **Layered structure.** routes → controllers → services → repositories.
- **Extensible model.** `Product` base table + `Coupon` type table (1:1); a new
  product type means a new table, not a rewrite.
