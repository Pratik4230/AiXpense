# AiXpense — Feature Todo List

---

## Done — Pricing Fix

- [x] Change free tier limit from 5 → 7 messages/day (daily reset via `freeTrialResetAt`)
- [x] Update all UI copy mentioning "5 free entries" to "7 free messages / day"
- [x] Show "Free Plan — X of 7 messages used" progress bar in profile
- [x] Show sticky upgrade banner when user hits 5+ messages used (≤ 2 remaining)
- [x] Add Pricing section on landing page with Free vs Premium comparison table
- [x] Mark yearly plan (₹4000) as "Best Value" — saves ₹2000 vs monthly

---

## Done — Inngest Background Jobs

- [x] Install `inngest`, create client with id `aixpense`
- [x] `src/app/api/inngest/route.ts` — serves all functions, no `force-dynamic` needed (API routes are dynamic by default)
- [x] `src/inngest/index.ts` — barrel: `[onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified]`
- [x] Test local dev UI at `localhost:8288`
- [ ] Add `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` to `.env` before production deploy

### Onboarding Drip (`user/created`)
- [x] `auth.ts` after hook fires `user/created` (fire-and-forget, try/catch wrapped)
- [x] Wait 10 min → check `emailVerified` via raw MongoDB driver — return early if false
- [x] Send `welcomeEmail` (CTA → `/aixpense`, not `/chat`)
- [x] Wait 1 day → count expenses → if 0 → send `nudgeDay1Email`
- [x] Wait 2 days → send `nudgeDay3Email` ("try Hinglish input")
- [x] Wait 4 days → send `nudgeDay7Email` ("one week in")
- [x] No cancel mechanism needed — drip is 7 days, nudges are generic

### AI Spending Coach (`aiCoachWeekly` + `aiCoachMonthly`)
- [x] Weekly cron: `30 3 * * 1` (Monday 9AM IST)
- [x] Monthly cron: `30 2 1 * *` (1st of month 8AM IST)
- [x] Only `isPremium=true + emailVerified=true` users
- [x] Idempotent via `periodKey` unique index on Insight model
- [x] Skip if `< 5 expenses` in period
- [x] Skip if `AiUsage cost > $0.10` this month (token budget guard)
- [x] Model: `gpt-5-mini` with `serviceTier: 'flex'` (50% cheaper, batch-equivalent)
- [x] No `maxOutputTokens` — warm, complete, natural insight
- [x] Save to `Insight` collection `{ userId, periodKey, content, tokensUsed, totalSpent, generatedAt }`
- [x] Send `coachInsightEmail` via Resend

### Cleanup Unverified Users
- [x] Monthly cron: `0 2 1 * *` (1st of month 2AM UTC)
- [x] `deleteMany` where `emailVerified=false AND createdAt < 30 days ago`
- [x] Uses MongoDB driver directly — bypasses Better Auth hooks

---

## Done — AI Coach Dashboard Card + Instagram Share

- [x] `GET /api/insights/latest` — returns latest Insight for authenticated user
- [x] `GET /api/og/insight?id=<id>` — returns 1080×1080 PNG via `next/og` (no extra deps)
- [x] `useLatestInsight()` — TanStack Query hook, 30min stale time
- [x] `CoachInsightCard` on `/reports` page:
  - Premium + insight → insight text + total spent + period + "Save for Instagram" button
  - Premium + no insight → "Your first insight will arrive after weekly/monthly summary"
  - Free user → blurred placeholder rows + lock icon + "Upgrade to unlock" CTA → `/premium`
- [x] "Save for Instagram" downloads 1080×1080 PNG — dark amber gradient, AiXpense branding, AI insight, ready to post

---

## Done — Chat Empty State Redesign

- [x] Animated node-graph background with SVG — dots connected by edges, particles travel along paths
- [x] Suggestions placed as nodes at graph positions (not a flat list)
- [x] Gradient heading "AiXpense Assistant" + glow icon
- [x] Removed `Suggestions` / `Suggestion` components — replaced with inline positioned buttons

---

## Pending — Production

- [ ] Add `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` to Vercel env vars
- [ ] Verify Inngest webhook URL in Inngest dashboard points to `https://aixpense.in/api/inngest`

---

## Done — Sprint: Voice Input

- [x] Mic button next to chat input
- [x] Sarvam AI saaras:v3 via `POST /api/voice` (backend-proxied, key never exposed)
- [x] MediaRecorder records `webm/opus` in browser
- [x] Silence detection via AudioContext + AnalyserNode (800ms, threshold 20)
- [x] Hardware noise suppression via getUserMedia constraints
- [x] Auto-submit after transcript fills input (useRef bridge for async state)
- [x] Manual mic click stop also supported
- [x] codemix mode — Hinglish, Marathi+Hindi+English all supported
- [x] System prompt updated for all Indian languages
- [x] Android-ready: same `/api/voice` route works for mobile app

---

## Pending — Sprint: Landing Page Demo (0.5 day)

- [ ] Record screen capture MP4 of full chat flow: voice input → AI responds → entry added
- [ ] Add demo video to landing page hero section (autoplay, muted, loop)

---

## Dropped

- **Receipt OCR pipeline** — too complex for current stage, not enough users to justify
- **Inactivity re-engagement cron** — expensive `$lookup` aggregation daily on all users, replaced by onboarding drip which already handles new user nudging
