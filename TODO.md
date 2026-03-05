# AiXpense — Feature Todo List

---

## Sprint 1 — Voice Input (1 day)

- [ ] Add mic button next to chat input
- [ ] Implement Web Speech API (`window.SpeechRecognition`), set `lang` to `en-IN`
- [ ] Show live interim transcript in input field while user speaks (italic/gray style)
- [ ] After speech ends, show "Confirm & Send" button — let user edit before submitting
- [ ] Hide mic button if browser doesn't support it, show tooltip "Works best on Chrome"
- [ ] Test with Hinglish: "aaj lunch 200 tha", "petrol bhara 800", "received salary 50000"
- [ ] Handle mic permission denied error with friendly message

---

## Sprint 1 — Pricing Fix (done)

- [x] Change free tier limit from 5 → 7 messages/day (daily reset via `freeTrialResetAt`)
- [x] Update all UI copy mentioning "5 free entries" to "7 free messages / day"
- [x] Show "Free Plan — X of 7 messages used" progress bar in profile
- [x] Show sticky upgrade banner when user hits 5+ messages used (≤ 2 remaining)
- [x] Add Pricing section on landing page with Free vs Premium comparison table
- [x] Mark yearly plan (₹4000) as "Best Value" — saves ₹2000 vs monthly

---

## Sprint 2 — Inngest Setup (0.5 day)

- [ ] Install `inngest` and `@inngest/next` packages
- [ ] Create `src/inngest/client.ts` — export `inngest` client with app ID `aixpense`
- [ ] Create `src/app/api/inngest/route.ts` — serve all functions via `serve()`
- [ ] Test local dev UI at `localhost:8288`
- [ ] Add `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to `.env`

---

## Sprint 3 — Budget Alert via Inngest (0.5 day)

- [ ] In `saveExpense` tool: after saving, fire `inngest.send("expense/saved", { userId, categoryId, amount })`
- [ ] Create Inngest function `budget.alert` listening on `expense/saved`
- [ ] Fetch user's budget for that category and calculate % used
- [ ] If usage >= 80% and no alert sent in last 24h: send email alert "You've used 80% of your Food budget"
- [ ] If usage >= 100%: send "Budget exceeded" alert with overspent amount
- [ ] Store last alert sent timestamp in DB to prevent spam
- [ ] Show in-app notification on dashboard (not just email)

---

## Sprint 4 — Receipt OCR Pipeline via Inngest (1 day)

- [ ] Add image attachment button in `ChatInput.tsx` (accept: image/\*)
- [ ] On image select: upload to `/api/receipt/upload`, store in `/tmp` or S3, return `receiptId`
- [ ] Fire Inngest event `receipt/uploaded` with `{ userId, receiptId, imageUrl }`
- [ ] **Step 1**: Validate image — check size < 5MB, format is jpeg/png/webp
- [ ] **Step 2**: Call OpenAI Vision API — extract `amount`, `category`, `merchant`, `date`
- [ ] **Step 3**: Parse and validate structured output with Zod schema
- [ ] **Step 4**: Auto-call `saveExpense` with extracted data
- [ ] **Step 5**: Mark receipt as processed, return confirmation message in chat
- [ ] Each step retries independently (max 3 retries) — no data loss on API timeout
- [ ] Show "Scanning receipt..." skeleton in chat while pipeline runs

---

## Sprint 5 — User Onboarding Drip via Inngest (1 day)

- [ ] On `user.created` event (fired from Better Auth `onSuccess` hook): start drip
- [ ] Create Inngest function `onboarding.drip` triggered by `user/created`
- [ ] **Step 1** [0 min]: Send welcome email — "Welcome to AiXpense, here's how to add your first expense"
- [ ] **Step 2** [24h later]: `step.sleep("1 day")` → check if user has 0 entries → send "Add your first expense" nudge email
- [ ] **Step 3** [3 days later]: `step.sleep("2 days")` → send "Try voice input" tip email with GIF demo
- [ ] **Step 4** [7 days later]: `step.sleep("4 days")` → send "Your first week summary" — total spent if any entries, else re-engagement
- [ ] Cancel drip if user adds 5+ entries (considered activated) — use `inngest.cancelRun()`
- [ ] All emails use Resend with React Email templates

---

## Sprint 6 — Inactivity Re-engagement via Inngest (0.5 day)

- [ ] Create Inngest cron function `reengagement.check` — runs every day at 8AM IST (`0 2 30 * * *` UTC)
- [ ] Query users: `lastEntryAt < 7 days ago` AND `lastNudgeSentAt < 14 days ago`
- [ ] Skip free users with 0 premium history (cold leads, not worth emailing)
- [ ] Send re-engagement email: "Where did your money go? Log expenses in seconds with voice"
- [ ] Update `lastNudgeSentAt` in DB after sending
- [ ] Track email open rate via Resend webhook → stop sending to users who never open

---

## Sprint 7 — AI Spending Coach via Inngest (1 day)

- [ ] Create Inngest cron `coach.weekly` — every Monday 9AM IST (`0 3 30 * * 1` UTC)
- [ ] Create Inngest cron `coach.monthly` — 1st of month 8AM IST (`0 2 30 1 * *` UTC)
- [ ] Only process Premium users with 5+ entries in the period
- [ ] Skip users who already got an insight for that period (idempotent)
- [ ] Aggregate: total spend, per-category breakdown, top merchant, biggest single expense, delta vs previous period
- [ ] Send to OpenAI with financial coach system prompt — 3-4 lines, specific numbers, one actionable tip
- [ ] Store insight in DB with `{ userId, periodKey, content, tokensUsed, generatedAt }`
- [ ] Hard cap: skip if user has cost > $0.10 this month (token budget guard)
- [ ] Dashboard: "Your Weekly Summary" card with insight text, date range, category breakdown chart
- [ ] Free users: blurred card with "Upgrade to unlock AI insights" CTA

---

## Sprint 8 — Landing Page Demo (0.5 day)

- [ ] Record screen capture MP4 of full chat flow: voice input → AI responds → entry added
- [ ] Add demo video to landing page hero section (autoplay, muted, loop)
