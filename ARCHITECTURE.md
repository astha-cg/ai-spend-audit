# Architecture

## Overview

AI Spend Audit is a full-stack web application that helps companies analyze their AI subscription spending and discover optimization opportunities.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Supabase

### AI Integration
- OpenAI API / Anthropic API

### Deployment
- Vercel

---

## System Flow

```text
User Input Form
      ↓
Audit Engine
      ↓
Savings Calculation
      ↓
AI Summary Generation
      ↓
Results Page
      ↓
Lead Capture + Database Storage
```

---

## Data Flow

1. User enters AI tool subscriptions
2. Form data is validated
3. Audit engine compares plans and pricing
4. Savings are calculated
5. AI generates personalized recommendations
6. Results are displayed
7. Lead data stored in Supabase

---

## Future Scalability

If handling 10k+ audits/day:
- Add Redis caching
- Queue AI requests
- Add rate limiting
- Use edge functions
- Optimize database indexing