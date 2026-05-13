# ARCHITECTURE.md

# AI Spend Audit Platform — System Architecture

---

# 📌 Overview

AI Spend Audit Platform is a full-stack AI-powered SaaS application that analyzes AI subscription spending, detects overspending, recommends optimized plans/tools, and generates AI-driven audit reports.

The platform combines:

- Dynamic pricing intelligence
- AI recommendation systems
- Cost optimization algorithms
- Supabase database integration
- OpenAI-generated summaries
- PDF report generation
- Authentication & audit persistence

---

# 🏗️ High-Level Architecture

```text
┌──────────────────────┐
│      Frontend        │
│  Next.js + React UI  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Audit Engine     │
│ Recommendation Logic │
│ Dynamic Calculations │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     API Routes       │
│  OpenAI + Email API  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Supabase        │
│ Auth + Database      │
└──────────────────────┘
```

---

# ⚙️ Core Components

---

# 1. Frontend Layer

## Technology

- Next.js
- React
- Tailwind CSS
- TypeScript

## Responsibilities

- User input collection
- Rendering audit results
- Showing optimization recommendations
- Downloading PDF reports
- Triggering AI summaries
- Authentication UI

## Key Pages

```text
/app
 ├── page.tsx
 ├── audit/page.tsx
 ├── results/page.tsx
 ├── login/page.tsx
```

---

# 2. Audit Engine

## File

```text
/lib/auditEngine.ts
```

## Responsibilities

- Calculate current spend
- Calculate optimized spend
- Generate estimated savings
- Recommend optimized plans
- Select alternative AI tools

## Formula

```ts
currentCost = monthlySpend

newCost =
teamSize * planCost

estimatedSavings =
currentCost - newCost
```

## Example

```ts
monthlySpend = 500
teamSize = 10
planCost = 20

newCost = 200
estimatedSavings = 300
```

---

# 3. Pricing Engine

## File

```text
/lib/pricingData.ts
```

## Purpose

Stores pricing intelligence for:

- ChatGPT
- Claude
- Cursor
- Gemini
- GitHub Copilot
- Windsurf

## Example Structure

```ts
export const pricingData = {
  ChatGPT: {
    plus: 20,
    team: 30,
  },

  Cursor: {
    pro: 20,
    business: 40,
  },
};
```

---

# 4. Recommendation Engine

## Purpose

Finds the best pricing plan based on:

- Team size
- Current spend
- Use case
- Historical recommendations
- Optimization score

## Current Logic

```ts
IF savings > 0
THEN recommend cheaper plan
```

## Future AI Learning Logic

```ts
IF
80% coding teams
save money with Cursor

THEN
boost Cursor recommendation score
```

---

# 5. AI Summary Generation

## API Route

```text
/app/api/generate-summary/route.ts
```

## Responsibilities

- Send audit data to OpenAI
- Generate intelligent summaries
- Return personalized recommendations

## Flow

```text
Frontend
   ↓
API Route
   ↓
OpenAI API
   ↓
AI Summary
```

---

# 6. Authentication Layer

## Provider

Supabase Auth

## Features

- Email authentication
- User sessions
- Protected report saving
- Audit ownership

## Flow

```text
User Login
   ↓
Supabase Auth
   ↓
Session Created
   ↓
Access Protected Features
```

---

# 7. Database Layer

## Provider

Supabase PostgreSQL

## Table

```text
audits
```

## Stored Fields

```sql
id
company
team_size
savings
recommended_tool
recommended_plan
use_case
created_at
```

## Responsibilities

- Save audit history
- Store recommendations
- Collect analytics
- Future ML learning data

---

# 8. PDF Generation System

## Library

```text
jsPDF
```

## Responsibilities

- Generate downloadable reports
- Export audit results
- Create shareable summaries

## Generated Data

- Recommended plan
- Savings
- Annual savings
- Optimization insights

---

# 9. Email Report System

## Planned API Route

```text
/app/api/send-report/route.ts
```

## Responsibilities

- Send reports via email
- Share audit summaries
- Deliver downloadable links

## Planned Integrations

- Resend
- Nodemailer
- SendGrid

---

# 🔄 Data Flow

---

# Step 1 — User Input

User enters:

- Tool
- Plan
- Team size
- Spend
- Use case

↓

Stored in:

```text
localStorage
```

↓

Passed into:

```ts
generateAudit()
```

---

# Step 2 — Audit Calculation

System calculates:

```ts
newCost =
teamSize * planCost
```

↓

Then:

```ts
estimatedSavings =
currentCost - newCost
```

↓

Recommendation generated

---

# Step 3 — AI Summary

Audit result sent to:

```text
/api/generate-summary
```

↓

OpenAI generates:

- Summary
- Optimization suggestions
- Savings explanation

---

# Step 4 — Database Storage

Audit saved to Supabase:

```sql
INSERT INTO audits
```

↓

Data becomes future learning dataset

---

# 🧠 Future AI Learning Architecture

---

# Goal

Transform the platform into:

```text
AI-Powered Recommendation Intelligence System
```

---

# Planned Learning Pipeline

```text
User Audits
    ↓
Supabase Database
    ↓
Analytics Engine
    ↓
Pattern Detection
    ↓
Recommendation Scoring
    ↓
Smarter Future Recommendations
```

---

# Example Intelligence Rules

```ts
IF
many startups
save with ChatGPT Team

THEN
increase recommendation priority
```

---

# 📊 Planned Analytics Dashboard

## Metrics

- Most overspent tools
- Average savings per tool
- Best plans for coding teams
- Enterprise optimization trends
- Most recommended downgrades

---

# 🚀 Deployment Architecture

## Hosting

Vercel

## Deployment Flow

```text
GitHub Push
   ↓
Vercel Build
   ↓
Next.js Deployment
   ↓
Live SaaS Platform
```

---

# 🔐 Security Architecture

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## Security Features

- Secure API routes
- Environment variable protection
- Authenticated report access
- Supabase Row Level Security (future)

---

# 📂 Folder Structure

```text
app/
 ├── api/
 │    ├── generate-summary/
 │    └── send-report/
 │
 ├── audit/
 ├── results/
 ├── login/

lib/
 ├── auditEngine.ts
 ├── pricingData.ts
 ├── supabase.ts

data/
 ├── tools.ts
 ├── pricing.csv

public/
 ├── screenshots/
```

---

# 🛠️ Scalability Plans

Future scaling goals:

- Real-time pricing APIs
- Admin dashboard
- Multi-company analytics
- AI learning engine
- Stripe billing integration
- Multi-user organizations
- Audit export center

---

# 🧪 Testing Strategy

## Manual Testing

- Pricing calculations
- Negative savings prevention
- Authentication flow
- PDF downloads
- Email delivery

## Future

- Jest unit testing
- Playwright E2E testing
- API integration tests

---

# 👩‍💻 Developer

Astha Chouhan

- Full Stack Developer
- AI SaaS Builder
- B.Tech CSE

GitHub:
https://github.com/astha-cg

---