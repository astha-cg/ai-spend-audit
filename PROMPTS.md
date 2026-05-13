# PROMPTS.md

# AI Prompts Used in the Project

This document contains the prompts used inside the AI Spend Audit platform.

---

# 1. AI Audit Summary Prompt

Used in:
`/api/generate-summary/route.ts`

Purpose:
Generate personalized audit insights for the user.

---

## Prompt

```txt
You are an AI infrastructure cost optimization expert.

Analyze the following AI software spending setup and provide a concise optimization summary.

Current Tool: {tool}
Current Plan: {plan}
Monthly Spend: ${monthlySpend}
Team Size: {teamSize}
Use Case: {useCase}

Recommended Plan: {recommendedPlan}
Estimated Monthly Savings: ${estimatedSavings}

Your task:
- Explain whether the company is overspending
- Explain why the recommended plan is better
- Mention possible annual savings
- Keep the response concise and professional
- Limit response to 120 words

## 2. Recommendation Engine Logic Prompt

## Purpose:
Generate recommendation reasoning.

IF use case is coding
THEN prioritize:
- Cursor
- GitHub Copilot
- Windsurf

IF use case is research/writing
THEN prioritize:
- ChatGPT
- Claude
- Gemini

IF team size > 5
THEN prioritize team/business plans

IF estimated savings <= 0
THEN show:
"Your current setup already appears optimized."

3. Future Learning Recommendation Prompt

Purpose:
Dynamic recommendation learning from previous audits.

Analyze historical audit data.

Identify:
- Most overspent tools
- Most recommended alternatives
- Average savings per tool
- Best plans for coding teams
- Best plans for startups

Use these insights to improve future recommendations.

4. PDF Report Content Prompt

Purpose:
Generate downloadable audit reports.

Prompt
Generate a professional AI spend audit report including:
- Current tool and plan
- Recommended alternative
- Estimated monthly savings
- Estimated annual savings
- Optimization summary
- Audit ID
5. Email Report Prompt

Purpose:
Send audit report via email.

Prompt
Subject:
Your AI Spend Audit Report

Body:
Your AI infrastructure audit has been completed successfully.

View your report:
{reportUrl}

Estimated Savings:
${estimatedSavings}/month

Thank you for using AI Spend Audit.