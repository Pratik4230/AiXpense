# AiXpense — Feature Todo List

---

## Sprint 1 — Voice Input (1-2 days)

- [ ] Add mic button next to chat input
- [ ] Implement Web Speech API (`window.SpeechRecognition`), set `lang` to `en-IN`
- [ ] Show live interim transcript in input field while user speaks (italic/gray style)
- [ ] After speech ends, show "Confirm & Send" button — let user edit before submitting
- [ ] Hide mic button if browser doesn't support it, show tooltip "Works best on Chrome"
- [ ] Test with Hinglish: "aaj lunch 200 tha", "petrol bhara 800", "received salary 50000"
- [ ] Handle mic permission denied error with friendly message

---

## Sprint 1 — Pricing Fix (half day)

- [x] Change free tier limit from 5 → 7 messages/day (daily reset via `freeTrialResetAt`)
- [x] Update all UI copy mentioning "5 free entries" to "7 free messages / day"
- [x] Show "Free Plan — X of 7 messages used" progress bar in profile
- [x] Show sticky upgrade banner when user hits 5+ messages used (≤ 2 remaining)
- [x] Add Pricing section on landing page with Free vs Premium comparison table
- [x] Mark yearly plan (₹4000) as "Best Value" — saves ₹2000 vs monthly

---

## Sprint 2 — Public Report Cards (3-4 days)

- [ ] Design shareable report card UI: total spent, date range, top 3 categories, biggest expense, transaction count
- [ ] Add "Made with AiXpense" watermark on every card
- [ ] Backend: `POST /api/report/generate` — aggregate user data, save snapshot with unique slug, return public URL
- [ ] Public page: `aixpense.in/report/[slug]` — no auth required
- [ ] Show "Report expired" or "Not found" for invalid/expired slugs
- [ ] Add expiry option: 7 days / 30 days / never
- [ ] Add dynamic Open Graph meta tags for WhatsApp/Twitter preview (title, description, image)
- [ ] Add share buttons: WhatsApp (`wa.me`), Twitter/X, Copy Link with toast
- [ ] Public view shows summary only; owner (logged in) sees full transaction list
- [ ] Add "Make Private" toggle to revoke public access without deleting

---

## Sprint 3 — AI Spending Coach (3-4 days)

- [ ] BullMQ repeatable job: every Monday 9AM IST (weekly) + 1st of month 8AM IST (monthly)
- [ ] Only process Premium users who have 5+ entries in the period
- [ ] Skip users who already got an insight for that period
- [ ] Aggregate per user: total spend, per-category breakdown, top merchant, biggest expense, vs previous period
- [ ] Send aggregated data to AI with a financial coach system prompt — 3-4 lines max, specific numbers, one actionable tip
- [ ] Store generated insight in DB against `userId + period key` (don't regenerate on every view)
- [ ] Track token usage per generation, set a hard cost cap per user
- [ ] Dashboard: show "Your Weekly Summary" card with insight text and date range
- [ ] Free users see blurred/locked card with "Upgrade to Premium" CTA — do NOT generate insights for free users

---

## Sprint 4 — Landing Page (2-3 days)

- [ ] Record a screen capture GIF/MP4 of the full chat flow: type expense → AI responds → entry added
- [ ] Add the demo video to the landing page hero section
- [ ] Add meta description tag and Open Graph tags to homepage
- [ ] Generate and submit `sitemap.xml` to Google Search Console

---

## Tech Debt

- [ ] **Remove manual memoization across entire app** — React 19 + React Compiler handles memoization automatically. Strip all `useMemo`, `useCallback`, and `React.memo`/`memo()`. `useRef` and `useState` should stay.
- [ ] **Receipt image scanning** — Image attachment in `ChatInput.tsx` → pass as `type: "image"` content → model auto-calls `saveExpense`.
