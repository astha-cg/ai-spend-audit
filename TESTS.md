# TESTS.md

# AI Spend Audit Platform — Testing Documentation

## Purpose

This document contains all manual test cases, validation scenarios, edge cases, and expected outputs for the AI Spend Audit Platform.

The goal is to ensure:

* accurate savings calculations,
* proper recommendation logic,
* stable UI behavior,
* successful API integrations,
* and production readiness.

---

# 1. Form Validation Tests

## Test Case 1 — Empty Form Submission

### Steps

1. Open audit page
2. Click “Analyze My AI Spend” without filling fields

### Expected Result

* Alert should appear:

```txt
Please fill all required fields
```

* User should not navigate to results page

### Status

✅ Passed

---

## Test Case 2 — Tool Selection Updates Plan Dropdown

### Steps

1. Select “ChatGPT”
2. Open Plan dropdown

### Expected Result

Plans displayed:

* Plus
* Team
* Enterprise

### Status

✅ Passed

---

## Test Case 3 — Invalid Number Input

### Steps

1. Enter negative team size
2. Submit form

### Expected Result

* Validation should prevent submission
* Negative values should not calculate

### Status

⚠️ Needs Improvement

---

# 2. Savings Calculation Tests

## Formula Used

```ts
const newCost =
  teamSize * planCost;

const estimatedSavings =
  currentCost - newCost;
```

---

## Test Case 4 — Positive Savings

### Input

| Field         | Value   |
| ------------- | ------- |
| Tool          | ChatGPT |
| Plan          | Team    |
| Monthly Spend | 200     |
| Team Size     | 5       |

### Calculation

```txt
New Cost = 5 × 20 = 100
Savings = 200 - 100 = 100
```

### Expected Result

* Monthly Savings = $100
* Annual Savings = $1200

### Status

✅ Passed

---

## Test Case 5 — Zero Savings

### Input

| Field         | Value |
| ------------- | ----- |
| Monthly Spend | 100   |
| Team Size     | 5     |
| Plan Cost     | 20    |

### Expected Result

```txt
New Cost = 100
Savings = 0
```

Display:

```txt
Your AI Spending Looks Optimized
```

### Status

✅ Passed

---

## Test Case 6 — Negative Savings Prevention

### Input

| Field         | Value |
| ------------- | ----- |
| Monthly Spend | 50    |
| Team Size     | 5     |
| Plan Cost     | 20    |

### Expected Result

```txt
New Cost = 100
Savings = -50
```

System should:

* prevent negative savings display
* fallback to current plan
* or show optimized message

### Status

⚠️ Fixed

---

# 3. Recommendation Engine Tests

## Test Case 7 — Coding Use Case

### Input

```txt
Use Case = coding
```

### Expected Result

System prioritizes:

* Cursor
* GitHub Copilot
* Windsurf

### Status

✅ Passed

---

## Test Case 8 — Research Use Case

### Input

```txt
Use Case = research
```

### Expected Result

System prioritizes:

* ChatGPT
* Claude
* Gemini

### Status

✅ Passed

---

# 4. Local Storage Tests

## Test Case 9 — Save Audit Data

### Steps

1. Fill form
2. Refresh page

### Expected Result

Form data remains populated

### Status

✅ Passed

---

## Test Case 10 — Missing Local Storage

### Steps

1. Clear browser localStorage
2. Open results page directly

### Expected Result

Display:

```txt
No Audit Data Found
```

### Status

✅ Passed

---

# 5. AI Summary API Tests

## Test Case 11 — AI Summary Generation

### Steps

1. Complete audit
2. Open results page

### Expected Result

* API route called successfully
* Summary generated dynamically

### Status

✅ Passed

---

## Test Case 12 — Missing OpenAI API Key

### Expected Result

Display:

```txt
Unable to generate AI summary.
```

### Status

✅ Passed

---

# 6. PDF Download Tests

## Test Case 13 — PDF Generation

### Steps

1. Click “Download PDF Report”

### Expected Result

PDF contains:

* Recommended Plan
* Monthly Savings
* Annual Savings
* Audit ID

### Status

✅ Passed

---

# 7. Authentication Tests

## Test Case 14 — User Authentication

### Steps

1. Login using Supabase Auth

### Expected Result

Authenticated user data available:

```ts
supabase.auth.getUser()
```

### Status

✅ Passed

---

# 8. Email Report Tests

## Test Case 15 — Send Report Button

### Expected Result

* API request triggered
* Email service sends report

### Previous Issue

```txt
prompt() is not supported
```

### Resolution

Replaced prompt-based input with controlled React input field.

### Status

⚠️ In Progress

---

# 9. Deployment Tests

## Test Case 16 — Vercel Build

### Issues Faced

* Missing environment variables
* Wrong build command
* TypeScript errors
* Missing default export

### Fixes Applied

* Added environment variables
* Fixed build command:

```json
"build": "next build"
```

* Added required exports

### Status

✅ Passed

---

# 10. Responsive UI Tests

## Desktop

### Status

✅ Passed

## Tablet

### Status

✅ Passed

## Mobile

### Issues

* Card spacing overflow
* Button alignment

### Status

⚠️ Needs Minor Improvements

---

# Future Automated Testing

## Planned Testing Stack

### Unit Testing

* Jest
* React Testing Library

### End-to-End Testing

* Playwright
* Cypress

### API Testing

* Postman
* Thunder Client

---

# Security Testing

## Planned

* API rate limiting
* Authentication protection
* Input sanitization
* SQL injection prevention
* Environment variable protection

---

# Performance Testing

## Planned Metrics

* Lighthouse Score
* First Contentful Paint
* API response times
* Database query performance

---

# Final Testing Summary

| Category              | Status                |
| --------------------- | --------------------- |
| Form Validation       | ✅ Stable              |
| Savings Calculation   | ✅ Stable              |
| Recommendation Engine | ✅ Stable              |
| AI Summary            | ✅ Stable              |
| PDF Download          | ✅ Stable              |
| Authentication        | ✅ Stable              |
| Email System          | ⚠️ In Progress        |
| Deployment            | ✅ Stable              |
| Mobile Responsiveness | ⚠️ Minor Fixes Needed |

---

# Overall Project Testing Status

## MVP Stability

✅ Functional

## Production Readiness

⚠️ Near Production Ready

## Remaining Improvements

* Better mobile responsiveness
