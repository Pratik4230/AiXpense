# AiXpense - TODO

## In Progress / Up Next

### 1. Receipt / Bill OCR Upload

- [ ] Upload receipt image (photo/file)
- [ ] AI extracts: amount, category, merchant, date via GPT-4o Vision
- [ ] Pre-fill "add expense" form from extracted data
- [ ] User confirms before saving

### 2. Voice Agent Support

- [ ] Voice input for adding expenses ("I spent 500 on groceries")
- [ ] Speech-to-text → AI parses and saves expense
- [ ] Available on dashboard as mic button

### 3. AI Monthly Summary

- [ ] AI-generated monthly insight on /reports page
- [ ] Streaming response for better UX
- [ ] POST /api/reports/summary endpoint

---

## Future / Backlog

- [ ] Multi-Currency Support (store currency on expense, convert to base for totals)

---

## Completed

- [x] Analytics & Reports page (/reports)
  - [x] Overview cards (total, count, top category, largest expense)
  - [x] Spending Trend chart (daily for 1m, monthly for 3m/6m/1y)
  - [x] Category Breakdown donut chart (24 distinct colors)
  - [x] Budget vs Actual progress bars
  - [x] Top Expenses / Top Income list with "View All" link
  - [x] Expenses / Income tab toggle (URL-based, persists on refresh)
  - [x] Date range selector (1m, 3m, 6m, 1y)
- [x] Transactions page (/transactions)
  - [x] Infinite scroll with useInfiniteQuery + IntersectionObserver
  - [x] Draft/applied filter pattern (Search button, no per-keystroke API calls)
  - [x] Filters: type, category multi-select, date range, amount range
  - [x] Sortable columns (date, amount, category)
  - [x] Color-coded amounts (red = expense, green = income)
- [x] Onboarding Flow (welcome → demo → AI insights intro)
- [x] OpenAI Cost Monitoring (admin dashboard at /admin, per-user breakdown)
- [x] Budgets & Budget Alerts (CRUD, progress bars, AI alerts on save)
- [x] Razorpay payment integration (create order, verify payment, webhooks)
- [x] Subscription model in MongoDB (plan, status, start/end dates, razorpay IDs)
- [x] Cancel subscription button in account settings
- [x] Update `isPremium` flag based on subscription status
- [x] Subscription expiry handling (revert to free tier when period ends)
- [x] Payment receipts via email (Resend)
- [x] Account deletion (cascade-delete all user data immediately)
- [x] Account settings/profile page (manage subscription, view plan, cancel)
- [x] Active Session Management (view/revoke sessions on other devices)
- [x] Rate Limiting on Auth Endpoints (in-memory, 10 req/60s)
- [x] Forgot/Reset Password (Resend email integration)
- [x] Email Verification (prevent fake accounts, protect free trials)
- [x] Middleware-Based Auth Guard (route protection)
- [x] Terms & Conditions page (`/terms`)
- [x] Privacy Policy page (`/privacy`)
- [x] Refund & Cancellation Policy page (`/refund`)
- [x] Contact Us page (`/contact`)
- [x] Shipping & Delivery Policy page (`/shipping`)
- [x] Footer links to all legal pages
