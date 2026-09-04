# AI Revenue Growth Agent

An **explainable merchant copilot** that identifies cross-sell opportunities, recommends safe promotions, enforces merchant-defined guardrails, and prepares test-mode commerce actions.

## Overview

The **AI Revenue Growth Agent** helps merchants increase revenue using their catalog and sales data.

The agent analyzes products, sales trends, basket relationships, and merchant rules to generate actionable recommendations. Every recommendation includes a **tool trace**, making the agent's decision-making transparent and easy to understand.

### Key Capabilities

* Identify product cross-sell opportunities
* Analyze sales and basket data
* Generate revenue growth recommendations
* Calculate safe discounts
* Enforce merchant-defined guardrails
* Estimate expected revenue lift
* Prepare Razorpay test-mode orders
* Provide a complete activity and tool trace
* Handle blocked and failed operations without fabricating data

## Features

### Dashboard

* Revenue and order metrics
* Average Order Value (AOV)
* Conversion rate
* Active revenue opportunities
* Top-performing products
* Revenue trends
<img width="1499" height="709" alt="image" src="https://github.com/user-attachments/assets/1702555a-0f9a-4633-ab05-c45201822517" />
<img width="1511" height="722" alt="image" src="https://github.com/user-attachments/assets/773a16d8-a5b7-4b3a-833c-f7f89d6700a8" />
<img width="1482" height="705" alt="image" src="https://github.com/user-attachments/assets/9cf64437-fcaf-4e5c-89c1-45307089f6c0" />


### AI Agent

Merchants can provide a goal such as:

> "Increase running shoe accessories revenue."

The agent follows a structured workflow:

```text
Goal
 ↓
Catalog Analysis
 ↓
Analytics
 ↓
Recommendation
 ↓
Offer Calculation
 ↓
Guardrail Check
 ↓
Test Order
```

Each step is recorded in the activity trace.

### Catalog

View:

* Products
* Prices
* Stock
* Units sold
* Revenue
* Attach rates
* Sales trends

### Analytics

Provides:

* Daily sales trends
* Revenue analysis
* Basket pairings
* Product attach rates
* Category revenue mix

### Merchant Guardrails

Merchants can configure:

* Maximum discount
* Minimum margin
* Maximum offer value
* Approval requirements
* Test-mode restrictions

## Architecture

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Express API Server
      │
      ├── Revenue Intelligence
      ├── Agent Orchestration
      ├── Guardrail Engine
      └── Razorpay Test Adapter
      │
      ▼
PostgreSQL
      │
      └── Drizzle ORM
```

## Tech Stack

| Layer               | Technology               |
| ------------------- | ------------------------ |
| Frontend            | React, Vite, TailwindCSS |
| UI                  | Radix UI                 |
| Backend             | Express 5                |
| Language            | TypeScript               |
| Database            | PostgreSQL               |
| ORM                 | Drizzle ORM              |
| Validation          | Zod                      |
| Data Fetching       | TanStack React Query     |
| API Specification   | OpenAPI 3.1              |
| API Code Generation | Orval                    |
| Charts              | Recharts                 |
| Package Manager     | pnpm                     |

## Project Structure

```text
AI-Revenue-Growth-Agent/
│
├── api-server/              # Express API server
├── revenue-growth-agent/    # React frontend
├── api-spec/                # OpenAPI specification
├── api-client-react/        # Generated React Query hooks
├── api-zod/                 # Generated Zod schemas
├── db/                      # Database schema and configuration
├── scripts/                 # Utility scripts
│
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Getting Started

### Prerequisites

* Node.js >= 24
* pnpm >= 9
* PostgreSQL

### Installation

```bash
git clone https://github.com/MahithaJV/AI-Revenue-Growth-Agent.git

cd AI-Revenue-Growth-Agent

pnpm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/revenue_agent
```

### Database Setup

```bash
pnpm --filter @workspace/db run push
```

### Run the Backend

```bash
pnpm --filter @workspace/api-server run dev
```

### Run the Frontend

```bash
pnpm --filter @workspace/revenue-growth-agent run dev
```

## API

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/healthz`             | Health check               |
| GET    | `/api/dashboard`           | Dashboard metrics          |
| GET    | `/api/catalog`             | Product catalog            |
| GET    | `/api/analytics`           | Sales and basket analytics |
| GET    | `/api/activity`            | Agent activity             |
| GET    | `/api/rules`               | Merchant guardrails        |
| PUT    | `/api/rules`               | Update guardrails          |
| POST   | `/api/offers/calculate`    | Calculate promotion        |
| POST   | `/api/agent/analyze`       | Run agent analysis         |
| POST   | `/api/razorpay/test-order` | Create test-mode order     |


```json
{
  "goal": "Increase running accessories revenue",
  "productId": "run-elite",
  "simulateFailure": false
}
```

The response includes the recommendation, confidence score, expected revenue lift, and the complete tool trace.

## Design Principles

* **Explainability** — every agent action is traceable.
* **Safety** — merchant-defined rules are enforced server-side.
* **Reliability** — unavailable data results in explicit failure or blocked states.
* **Test-first** — commerce actions are restricted to test mode by default.
* **API-first** — OpenAPI acts as the source of truth for the client and server contract.

## License

This project is licensed under the MIT License.

---

**Built for intelligent and explainable commerce.**
