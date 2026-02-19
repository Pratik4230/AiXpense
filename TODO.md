# AiXpense - TODO

## Features to Build

### High Priority (Pre/During Razorpay Integration)

- [x] Razorpay payment integration (create order, verify payment, webhooks)
- [x] Subscription model in MongoDB (plan, status, start/end dates, razorpay IDs)
- [x] Cancel subscription button in account settings (calls Razorpay cancel API)
- [x] Update `isPremium` flag based on subscription status

### Post Razorpay Integration

- [x] Account deletion feature (Settings -> Delete Account -> wipes user data within 90 days)
- [x] Account settings/profile page (manage subscription, view plan, cancel)
- [x] Payment receipts via email (Resend)
- [x] Subscription expiry handling (revert to free tier when period ends)

### Legal/Compliance

- [x] Terms & Conditions page (`/terms`)
- [x] Privacy Policy page (`/privacy`)
- [x] Refund & Cancellation Policy page (`/refund`)
- [x] Contact Us page (`/contact`)
- [x] Shipping & Delivery Policy page (`/shipping`)
- [x] Footer links to all legal pages

### Auth Features (Priority Order)

- [x] Forgot/Reset Password (Resend email integration)
- [x] Email Verification (prevent fake accounts, protect free trials)
- [x] Middleware-Based Auth Guard (proxy.ts route protection, redirect logged-in users from /login)
- [x] Account/Profile Page (edit name, change password, view subscription status)
- [x] Active Session Management (view/revoke sessions on other devices)
- [x] Rate Limiting on Auth Endpoints (prevent brute-force login attempts)
- [x] Account Deletion (cascade-delete user data, GDPR compliance)
- [ ] ~~Two-Factor Authentication (TOTP-based 2FA via better-auth plugin)~~ — skipped
