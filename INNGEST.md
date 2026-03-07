# Inngest Implementation — AiXpense

Inngest provides durable background jobs and scheduled crons for AiXpense.
All jobs are fully async and non-blocking — they run completely outside the HTTP request cycle.

---

## Architecture Overview

```
User signs up
  └─► auth.ts fires inngest.send("user/created")  [fire-and-forget]
        └─► onboardingDrip runs over 7 days

User logs expense
  └─► saveExpense.ts — no Inngest calls, no blocking

Weekly cron (Mon 3:30AM UTC)
  └─► aiCoachWeekly — GPT insight → DB → email

Monthly cron (1st 2:30AM UTC)
  └─► aiCoachMonthly — same as above, monthly window
  └─► cleanupUnverified — delete ghost accounts
```

---

## Setup — All Done

| File | Purpose | Status |
| ---------------------------------------- | -------------------------------------- | ------ |
| `src/inngest/client.ts` | Inngest client, id: `aixpense` | ✅ |
| `src/inngest/index.ts` | Barrel — exports all functions | ✅ |
| `src/app/api/inngest/route.ts` | Serve handler (GET, POST, PUT) | ✅ |
| `src/lib/auth.ts` | `after` hook fires `user/created` | ✅ |
| `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` | Required for production (add to `.env`) | ⚠️ |

---

## Schema — All Done

| Model | File | Fields |
| ------- | ----------------------- | ------------------------------------------------ |
| Insight | `src/models/Insight.ts` | `userId, periodKey, content, tokensUsed, totalSpent, generatedAt` |

`periodKey` format:
- Weekly: `week-YYYY-MM-DD` (Monday date)
- Monthly: `month-YYYY-MM`

Unique index on `{ userId, periodKey }` — guarantees idempotency.

---

## Email Templates — All Done

| File | Exports | Used By |
| ----------------------------------------- | --------------------------------------------------- | ---------------------- |
| `src/lib/email/templates/welcome.ts` | `welcomeEmail({ name })` | onboardingDrip step 3 |
| `src/lib/email/templates/nudge.ts` | `nudgeDay1Email`, `nudgeDay3Email`, `nudgeDay7Email` | onboardingDrip steps 5,7,9 |
| `src/lib/email/templates/coachInsight.ts` | `coachInsightEmail({ name, insight, period, totalSpent })` | aiCoach |

All use `baseLayout()` + `actionButton()` from `base.ts`.
CTA links point to `https://aixpense.in/aixpense` (not `/chat`).

---

## Function 1 — Onboarding Drip ✅

**File:** `src/inngest/onboardingDrip.ts`
**Trigger:** event `user/created`
**No cancel** — drip runs for 7 days regardless (nudge emails are generic enough)

### Flow

```
user/created
  └─► sleep 10m
  └─► check emailVerified via MongoDB driver
        └─► if false → return early (no emails sent to unverified)
        └─► if true → send welcomeEmail (CTA: Add Your First Expense)
              └─► sleep 1d
              └─► count expenses → if 0 → send nudgeDay1Email ("haven't logged yet")
              └─► sleep 2d
              └─► send nudgeDay3Email ("try Hinglish input: aaj lunch 200 tha")
              └─► sleep 4d
              └─► send nudgeDay7Email ("one week in — where does your money go?")
```

### Key decisions
- `emailVerified` checked via raw `db.collection("user")` — Better Auth's native collection, no Mongoose model needed
- Day 1 nudge is **conditional** — skipped if user already has expenses
- Days 3 and 7 always send (generic tips, useful even for active users)
- No `cancelOn` — simpler, and the 7-day window is short enough

---

## Function 2 — AI Spending Coach ✅

**Files:** `src/inngest/aiCoach.ts` — exports `aiCoachWeekly` + `aiCoachMonthly`

| Function | Trigger | Period |
| ---------------- | ------------------- | ------------ |
| `aiCoachWeekly` | cron `30 3 * * 1` | Previous week (Mon–Sun) |
| `aiCoachMonthly` | cron `30 2 1 * *` | Previous calendar month |

### Flow (shared `runCoachForPeriod`)

```
fetch all isPremium=true + emailVerified=true users
  └─► for each user:
        1. check Insight collection for this periodKey → skip if exists (idempotent)
        2. aggregate expenses for period:
             total, count, per-category breakdown, biggest expense
        3. skip if count < 5 (not enough data)
        4. check AiUsage: skip if user already cost > $0.10 this month (cost guard)
        5. call gpt-5-mini with serviceTier: flex (50% cheaper, batch-like)
             system: warm, encouraging finance coach, no bullet points, no length limit
             user: total, top 3 categories, biggest expense, transaction count
        6. save to Insight collection
        7. send coachInsightEmail
```

### Model: gpt-5-mini + serviceTier: flex
- `flex` = OpenAI's lower-priority processing tier, same 50% discount as Batch API
- No `maxOutputTokens` — model writes as much as needed for a warm, complete insight
- Background cron timing means added latency from `flex` doesn't matter

---

## Function 3 — Cleanup Unverified Users ✅

**File:** `src/inngest/cleanupUnverified.ts`
**Trigger:** cron `0 2 1 * *` (1st of month, 2AM UTC = 7:30AM IST)

```
deleteMany from user collection:
  emailVerified = false AND createdAt < 30 days ago
```

Uses MongoDB driver directly — bypasses Better Auth hooks to avoid side effects.
Returns `{ deleted: N }` for Inngest logs.

---

## Dashboard — Coach Insight Card ✅

### API Routes

| Route | Method | Description |
| ----------------------------- | ------ | --------------------------------------- |
| `/api/insights/latest` | GET | Returns latest Insight for current user |
| `/api/og/insight?id=<id>` | GET | Returns 1080×1080 PNG for Instagram share |

### Frontend

**File:** `src/components/reports/CoachInsightCard.tsx`
**Placed:** `/reports` page, below OverviewCards

**States:**
| User state | What they see |
| ----------------------- | -------------------------------------------- |
| Premium + has insight | Insight text, total spent, period, download button |
| Premium + no insight | "Your first insight will arrive after weekly/monthly summary" |
| Free user | Blurred placeholder rows + Lock icon + "Upgrade to unlock" CTA |

### Instagram Share

Button: **"Save for Instagram"** → `GET /api/og/insight?id=xxx`

The OG route (`src/app/api/og/insight/route.tsx`) uses `next/og` `ImageResponse` to render a **1080×1080 PNG**:
- Dark amber gradient background
- AiXpense branding (top left)
- Period label + total spent (large, hero)
- AI insight text (full, no truncation)
- `aixpense.in` footer
- Zero extra npm dependencies

Downloaded as: `aixpense-insight-month-2026-02.png`

---

## Events Reference

| Event | Fired From | Consumed By |
| -------------- | ------------------------- | ---------------- |
| `user/created` | `auth.ts` — `create.after` hook | `onboardingDrip` |

`user/activated` was considered (cancel drip on 5th expense) but removed — unnecessary complexity, drip is short and nudges are generic.

---

## Files Modified / Created

| File | Change |
| --------------------------------------------- | ---------------------------------------------------- |
| `src/inngest/client.ts` | id changed from `my-app` to `aixpense` |
| `src/inngest/index.ts` | Barrel: `[onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified]` |
| `src/app/api/inngest/route.ts` | Serves from barrel index |
| `src/app/api/insights/latest/route.ts` | New — latest insight for authenticated user |
| `src/app/api/og/insight/route.tsx` | New — 1080×1080 PNG via next/og |
| `src/inngest/onboardingDrip.ts` | New |
| `src/inngest/aiCoach.ts` | New — exports `aiCoachWeekly` + `aiCoachMonthly` |
| `src/inngest/cleanupUnverified.ts` | New |
| `src/models/Insight.ts` | New |
| `src/models/index.ts` | Added Insight export |
| `src/services/insights.ts` | New — TanStack Query hook `useLatestInsight` |
| `src/components/reports/CoachInsightCard.tsx` | New |
| `src/components/reports/index.ts` | Added CoachInsightCard export |
| `src/app/(protected)/reports/page.tsx` | Added `<CoachInsightCard />` |
| `src/lib/email/templates/welcome.ts` | New |
| `src/lib/email/templates/nudge.ts` | New |
| `src/lib/email/templates/coachInsight.ts` | New |
| `src/lib/email/templates/index.ts` | Updated — exports all new templates |

---

## Resume Points

### Full (use when you have space)

- Built a durable background job system using Inngest — event-driven onboarding drip (welcome → nudge over 7 days), weekly/monthly AI spending coach with GPT-5-mini (`serviceTier: flex` for 50% cost reduction), and automated DB cleanup cron; all jobs are fully async and retry-safe outside the HTTP cycle
- Engineered an AI coach pipeline that aggregates per-user expense data, guards token cost per user (<$0.10/month), calls GPT-5-mini, persists insights to MongoDB with idempotent `periodKey`, and delivers personalized spending summaries via email — served exclusively to premium users
- Generated shareable 1080×1080 Instagram cards from AI spending insights using `next/og` ImageResponse — zero client-side dependencies, rendered server-side on demand

### Short (use when space is tight)

- Implemented durable background automation with Inngest: 7-day onboarding email drip, weekly AI spending coach (GPT-5-mini, cost-guarded per user), and monthly DB cleanup cron — fully non-blocking, retry-safe
- Built premium AI coach feature: expense aggregation → GPT insight generation → email delivery → shareable Instagram card via `next/og`, all triggered by cron with idempotency guarantees

### Keywords

`Inngest` · `event-driven architecture` · `durable background jobs` · `cron automation` · `idempotency` · `GPT-5-mini` · `cost optimization` · `next/og` · `async pipelines`
