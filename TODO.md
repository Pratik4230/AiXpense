# AiXpense - TODO

## In Progress / Up Next

### 1. Onboarding Flow

- [x] Detect new user (first login, no expenses yet)
- [x] Show onboarding modal/steps: welcome → natural language demo → AI insights intro
- [x] Mark onboarding complete in user record (`onboardingCompleted: true`)
- [x] Skip button available at any step

### 2. OpenAI Cost Monitoring (admin: pratikjadhav1438@gmail.com only)

- [x] Track tokens used per AI request (prompt + completion tokens)
- [x] Store in `aiUsage` collection: `{ userId, tokens, model, cost, createdAt }`
- [x] Admin dashboard page (`/admin`) showing total cost, per-user breakdown, daily graph
- [x] Only accessible to pratikjadhav1438@gmail.com

### 3. Recurring Transactions

- [ ] Add `isRecurring` and `recurrenceInterval` fields to Expense model (daily/weekly/monthly)
- [ ] UI to mark an expense as recurring when adding
- [ ] Vercel Cron job to auto-create recurring expenses on schedule
- [ ] Show recurring badge on transaction list

### 4. Budgets & Budget Alerts

- [ ] Budget model: `{ userId, category, amount, period (monthly/yearly), createdAt }`
- [ ] Budget management UI (create, edit, delete budgets per category)
- [ ] Budget progress bars on dashboard (spent vs limit)
- [ ] Alert when user exceeds 80% and 100% of a budget (in-app + optional email)

---

## Completed

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
