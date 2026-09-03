# AI Revenue Growth Agent

An explainable merchant copilot that finds catalog cross-sell opportunities, checks offer guardrails, and prepares safe test-mode commerce actions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/revenue-growth-agent/src/` — React merchant command center and supporting routes.
- `artifacts/api-server/src/routes/revenue.ts` — seeded revenue signals, agent orchestration, merchant rules, offer checks, and local Razorpay test-mode adapter.
- `lib/api-spec/openapi.yaml` — source of truth for dashboard, catalog, analytics, activity, rules, offers, agent analysis, and test-order contracts.
- `artifacts/revenue-growth-agent/src/index.css` — shared commerce intelligence cockpit theme.

## Architecture decisions

- The first build uses a seeded in-memory merchant dataset to keep the hackathon demo self-contained and fast to reset.
- Agent analysis returns an ordered tool trace and stops with explicit failed/blocked states when analytics is unavailable; it never fills in a missing signal.
- Razorpay is represented by a local test-mode adapter unless the merchant explicitly connects a Razorpay account; the UI labels that boundary clearly.
- Merchant discount, margin, approval, and offer-value rules are applied server-side before a recommendation can be acted on.

## Product

- Command center for revenue health, active opportunities, and recent agent activity.
- Goal-driven revenue scan with catalog, analytics, recommendation, offer-calculation, guardrail, and test-mode steps.
- Catalog and analytics views for product signals, basket pairings, sales pulse, and category mix.
- Searchable activity trace and editable merchant guardrails.

## User preferences

No additional preferences recorded.

## Gotchas

- Standalone Vite builds need `PORT` and `BASE_PATH`; the managed web workflow supplies them automatically.
- Razorpay is intentionally not called when no connection is active; local test orders include a note that no external request was sent.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
