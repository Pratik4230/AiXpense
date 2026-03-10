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
- [x] `src/app/api/inngest/route.ts` — serves all functions
- [x] `src/inngest/index.ts` — barrel: `[onboardingDrip, aiCoachWeekly, aiCoachMonthly, cleanupUnverified]`
- [x] Test local dev UI at `localhost:8288`
- [x] Add `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` to Vercel env vars
- [x] Verify Inngest webhook URL in Inngest dashboard points to `https://aixpense.in/api/inngest`

### Onboarding Drip (`user/created`)
- [x] `auth.ts` after hook fires `user/created` (fire-and-forget, try/catch wrapped)
- [x] Wait 10 min → check `emailVerified` via raw MongoDB driver — return early if false
- [x] Send `welcomeEmail` (CTA → `/aixpense`, not `/chat`)
- [x] Wait 1 day → count expenses → if 0 → send `nudgeDay1Email`
- [x] Wait 2 days → send `nudgeDay3Email` ("try Hinglish input")
- [x] Wait 4 days → send `nudgeDay7Email` ("one week in")

### AI Spending Coach (`aiCoachWeekly` + `aiCoachMonthly`)
- [x] Weekly cron: `30 3 * * 1` (Monday 9AM IST)
- [x] Monthly cron: `30 2 1 * *` (1st of month 8AM IST)
- [x] Only `isPremium=true + emailVerified=true` users
- [x] Idempotent via `periodKey` unique index on Insight model
- [x] Skip if `< 5 expenses` in period
- [x] Skip if `AiUsage cost > $0.10` this month (token budget guard)
- [x] Model: `gpt-4o-mini` with `serviceTier: 'flex'`
- [x] Save to `Insight` collection, send `coachInsightEmail` via Resend

### Cleanup Unverified Users
- [x] Monthly cron: `0 2 1 * *` (1st of month 2AM UTC)
- [x] `deleteMany` where `emailVerified=false AND createdAt < 30 days ago`

---

## Done — AI Coach Dashboard Card

- [x] `GET /api/insights/latest` — returns latest Insight for authenticated user
- [x] `useLatestInsight()` — TanStack Query hook, 30min stale time
- [x] `CoachInsightCard` on `/reports` page with premium/free/no-insight states
- [x] AI prompt updated — no bullet points, no dashes, plain flowing sentences only
- [x] `cleanInsightText()` strips any residual dashes in frontend display and email template

---

## Done — Chat Empty State Redesign

- [x] Animated node-graph background with SVG — dots connected by edges, particles travel along paths
- [x] Suggestions placed as nodes at graph positions
- [x] Gradient heading "AiXpense Assistant" + glow icon

---

## Done — Voice Input

- [x] Two-row card input: textarea top, controls bottom (`mic` + `send`)
- [x] Sarvam AI saaras:v3 via `POST /api/voice` (backend-proxied, key never exposed)
- [x] MediaRecorder records `webm/opus` in browser
- [x] Silence detection via AudioContext + AnalyserNode (2000ms timeout, threshold 15)
- [x] Removed OS-level noise suppression — Sarvam model handles denoising server-side
- [x] Auto-submit after transcript fills input
- [x] Manual mic click stop also supported
- [x] codemix mode — Hinglish, Marathi+Hindi+English all supported
- [x] Persona (glint variant) shows listening/thinking state above input during recording
- [x] `ConversationScrollButton` wired in — floating ↓ button when user scrolls up

---

## Done — Production

- [x] `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` set in Vercel env vars
- [x] Inngest webhook URL verified in dashboard

---

## Up Next — Camera OCR

- [ ] Camera button in chat input (next to mic) — opens camera/file picker
- [ ] Capture receipt photo → send to `/api/ocr` endpoint
- [ ] OCR via OpenAI Vision (`gpt-4o`) — extract item, amount, date, merchant
- [ ] Return structured JSON → pre-fill chat input or directly save as expense
- [ ] Fallback: file upload (gallery pick) if no camera access
- [ ] Mobile-first: use `capture="environment"` on file input for rear camera

---

## Dropped

- **Inactivity re-engagement cron** — replaced by onboarding drip
- **Instagram Share (OG image)** — not aligned with product direction
