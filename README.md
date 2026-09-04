<![CDATA[# 🚀 AI Revenue Growth Agent

> An **explainable merchant copilot** that discovers catalog cross-sell opportunities, enforces merchant-defined guardrails, calculates safe promotions, and prepares test-mode commerce actions — all with full transparency into every step the agent takes.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Architecture Decisions](#architecture-decisions)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

The **AI Revenue Growth Agent** is an intelligent commerce copilot designed for merchants who want to maximize revenue through data-driven cross-sell strategies. Instead of acting as a black box, the agent surfaces a complete **tool trace** for every recommendation — showing which products it analyzed, which analytics signals it evaluated, and how it arrived at its final suggestion.

### What It Does

1. **Scans your catalog** for cross-sell pairings using attach rates, basket analysis, and sales trends
2. **Evaluates analytics signals** including sales velocity, category mix, and revenue potential
3. **Generates recommendations** with confidence scores, expected revenue lift, and discount calculations
4. **Enforces guardrails** — merchant-defined rules for max discount, min margin, offer caps, and approval gates
5. **Prepares test-mode orders** via a local Razorpay adapter so merchants can validate before going live

---

## Features

### 🏠 Command Center Dashboard
- Real-time revenue health metrics (total revenue, orders, AOV, conversion rate)
- Active opportunity tracking with estimated value
- Top-performing product spotlight
- Period-over-period trend indicators

### 🤖 Goal-Driven Agent Analysis
- Natural language goal input (e.g., *"Increase running shoe accessories revenue"*)
- Multi-step tool trace: Catalog → Analytics → Recommendation → Offer Calculation → Guardrail Check → Test Order
- Explicit **failed/blocked** states when data is unavailable — the agent never fabricates missing signals
- Confidence scoring and expected revenue lift estimates

### 📦 Catalog Explorer
- Full product catalog with price, stock, units sold, revenue, and attach rate
- Trend indicators (up/down/flat) per product
- Category-based organization

### 📊 Analytics Dashboard
- Daily sales pulse with revenue and order charts
- Basket pairing analysis with attach rates and revenue potential
- Category revenue mix with share distribution

### 📜 Activity Trace
- Searchable log of all agent actions
- Status tracking: `success`, `running`, `blocked`, `failed`
- Tool-level attribution for every action

### ⚙️ Merchant Guardrails
- Configurable maximum discount percentage
- Minimum margin percentage enforcement
- Maximum offer value cap
- Approval gate toggle
- Test-mode-only enforcement

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│            (Vite + TailwindCSS + Radix UI)              │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Dashboard │ │ Catalog  │ │Analytics │ │ Settings │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       │             │            │             │         │
│       └─────────────┴────────────┴─────────────┘         │
│                         │                                │
│              TanStack React Query                        │
│              (Orval-generated hooks)                     │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────┴──────────────────────────────┐
│                   Express 5 API Server                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Revenue Routes                       │   │
│  │                                                    │   │
│  │  /dashboard    — Aggregated merchant metrics      │   │
│  │  /catalog      — Product listing                  │   │
│  │  /analytics    — Sales, pairings, category mix    │   │
│  │  /activity     — Agent action log                 │   │
│  │  /rules        — Merchant guardrails CRUD         │   │
│  │  /offers/calc  — Safe promotion calculator        │   │
│  │  /agent/analyze— Goal-driven agent orchestration  │   │
│  │  /razorpay/*   — Test-mode order adapter          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌────────────────┐                   │
│  │ Seeded Data  │  │ Guardrail      │                   │
│  │ (In-Memory)  │  │ Engine         │                   │
│  └──────────────┘  └────────────────┘                   │
└──────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────┐
│             PostgreSQL + Drizzle ORM                     │
│             (lib/db with Zod validation)                 │
└──────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 24 |
| **Language** | TypeScript 5.9 |
| **Package Manager** | pnpm (workspaces) |
| **Frontend** | React 19, Vite, Wouter (routing) |
| **UI Components** | Radix UI, TailwindCSS, Framer Motion |
| **Charts** | Recharts |
| **Data Fetching** | TanStack React Query + Orval (codegen from OpenAPI) |
| **Backend** | Express 5 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Validation** | Zod v4, drizzle-zod |
| **API Contract** | OpenAPI 3.1 |
| **Build** | esbuild (CJS server bundle), Vite (frontend) |
| **Logging** | Pino + pino-http |

---

## Project Structure

```
AI-Revenue-Growth-Agent/
│
├── artifacts/
│   ├── api-server/               # Express API server
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── revenue.ts    # Core revenue intelligence routes + agent logic
│   │   │   │   └── health.ts     # Health check endpoint
│   │   │   ├── middlewares/      # Express middleware
│   │   │   ├── lib/              # Server utilities
│   │   │   ├── app.ts            # Express app setup
│   │   │   └── index.ts          # Server entry point
│   │   └── build.mjs             # esbuild configuration
│   │
│   ├── revenue-growth-agent/     # React merchant dashboard
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── home.tsx      # Command center dashboard
│   │   │   │   ├── catalog.tsx   # Product catalog explorer
│   │   │   │   ├── analytics.tsx # Analytics & insights
│   │   │   │   ├── activity.tsx  # Agent activity trace
│   │   │   │   └── settings.tsx  # Merchant guardrail settings
│   │   │   ├── components/
│   │   │   │   ├── layout.tsx    # App shell & navigation
│   │   │   │   ├── ui/           # Radix-based UI primitives
│   │   │   │   └── ui-kit.tsx    # Shared UI components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utility functions
│   │   │   ├── App.tsx           # Root component with routing
│   │   │   └── index.css         # Commerce intelligence theme
│   │   └── vite.config.ts        # Vite configuration
│   │
│   └── mockup-sandbox/           # UI prototyping sandbox
│
├── lib/
│   ├── api-spec/
│   │   ├── openapi.yaml          # OpenAPI 3.1 specification (source of truth)
│   │   └── orval.config.ts       # API client codegen config
│   ├── api-client-react/         # Generated React Query hooks
│   ├── api-zod/                  # Generated Zod schemas
│   └── db/
│       ├── src/schema/           # Drizzle ORM schema definitions
│       └── drizzle.config.ts     # Drizzle Kit configuration
│
├── scripts/                      # Build & utility scripts
├── package.json                  # Root workspace configuration
├── pnpm-workspace.yaml           # pnpm workspace definition
└── tsconfig.base.json            # Shared TypeScript config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 24
- **pnpm** ≥ 9
- **PostgreSQL** instance (local or hosted)

### Installation

```bash
# Clone the repository
git clone https://github.com/MahithaJV/AI-Revenue-Growth-Agent.git
cd AI-Revenue-Growth-Agent

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file or set the following environment variable:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/revenue_agent
```

### Database Setup

```bash
# Push the schema to your database
pnpm --filter @workspace/db run push
```

### Running the Application

```bash
# Start the API server (port 5000)
pnpm --filter @workspace/api-server run dev

# In a separate terminal, start the frontend
pnpm --filter @workspace/revenue-growth-agent run dev
```

### Building for Production

```bash
# Full typecheck + build across all packages
pnpm run build
```

---

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/healthz` | Health check |
| `GET` | `/dashboard` | Merchant dashboard summary (revenue, orders, AOV, opportunities) |
| `GET` | `/catalog` | List all catalog products |
| `GET` | `/analytics` | Sales-by-day, basket pairings, category mix |
| `GET` | `/activity` | Recent agent activity log |
| `GET` | `/rules` | Get current merchant guardrails |
| `PUT` | `/rules` | Update merchant guardrails |
| `POST` | `/offers/calculate` | Calculate a safe promotion for a product pair |
| `POST` | `/agent/analyze` | Run the agent against a merchant-defined goal |
| `POST` | `/razorpay/test-order` | Create a Razorpay test-mode order |

### Agent Analysis (`POST /agent/analyze`)

```json
{
  "goal": "Increase running accessories revenue",
  "productId": "run-elite",
  "simulateFailure": false
}
```

**Response** includes a full tool trace showing each step the agent took:

```json
{
  "id": "analysis-abc123",
  "goal": "Increase running accessories revenue",
  "status": "complete",
  "headline": "Cross-sell PaceForm Socks with AeroRun Elite",
  "confidence": 0.87,
  "expectedLift": 2340,
  "discountPercent": 12,
  "reasoning": "High attach rate between running shoes and socks...",
  "trace": [
    { "step": 1, "tool": "catalog-scan", "label": "Scanning catalog", "status": "complete", "durationMs": 120 },
    { "step": 2, "tool": "analytics-query", "label": "Checking signals", "status": "complete", "durationMs": 85 }
  ]
}
```

---

## Configuration

### Merchant Guardrails

Configure via the Settings page or `PUT /api/rules`:

| Rule | Description | Default |
|------|-------------|---------|
| `maxDiscountPercent` | Maximum allowed discount on any offer | 25% |
| `minMarginPercent` | Minimum margin that must be preserved | 15% |
| `maxOfferValue` | Cap on total offer value | ₹500 |
| `requireApproval` | Whether offers need manual approval | `true` |
| `testModeOnly` | Restrict to test-mode orders only | `true` |

### API Codegen

Regenerate React Query hooks and Zod schemas from the OpenAPI spec:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Seeded in-memory data** | Keeps the demo self-contained and fast to reset without external dependencies |
| **Ordered tool trace** | Every agent recommendation includes a step-by-step trace for full explainability |
| **Explicit failure states** | The agent returns `failed` or `blocked` when data is unavailable — it never fabricates signals |
| **Local Razorpay adapter** | Test-mode orders use a local adapter unless a live Razorpay account is connected; the UI labels this boundary |
| **Server-side guardrails** | Discount, margin, approval, and offer-value rules are enforced server-side before any recommendation is actionable |
| **OpenAPI-first** | The API spec is the single source of truth; client hooks and validation schemas are generated from it |

---

## Useful Commands

```bash
# Full typecheck across all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Run API server in development
pnpm --filter @workspace/api-server run dev

# Run frontend in development
pnpm --filter @workspace/revenue-growth-agent run dev

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push database schema changes (dev only)
pnpm --filter @workspace/db run push
```

---

## Gotchas

- Standalone Vite builds require `PORT` and `BASE_PATH` environment variables; the managed workflow supplies them automatically.
- Razorpay is intentionally **not** called when no connection is active; local test orders include a note that no external request was sent.
- The project enforces **pnpm only** — attempting to install with npm or yarn will fail by design.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for intelligent commerce
</p>
]]>
