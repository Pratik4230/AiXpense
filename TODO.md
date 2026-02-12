# AiXpense - TODO

## Features to Build

### High Priority (Pre/During Razorpay Integration)

- [ ] Razorpay payment integration (create order, verify payment, webhooks)
- [ ] Subscription model in MongoDB (plan, status, start/end dates, razorpay IDs)
- [ ] Cancel subscription button in account settings (calls Razorpay cancel API)
- [ ] Update `isPremium` flag based on subscription status

### Post Razorpay Integration

- [ ] Account deletion feature (Settings -> Delete Account -> wipes user data within 90 days)
- [ ] Account settings/profile page (manage subscription, view plan, cancel)
- [ ] Payment receipts via email (Resend)
- [ ] Subscription expiry handling (revert to free tier when period ends)

### Legal/Compliance

- [x] Terms & Conditions page (`/terms`)
- [x] Privacy Policy page (`/privacy`)
- [x] Refund & Cancellation Policy page (`/refund`)
- [x] Contact Us page (`/contact`)
- [x] Shipping & Delivery Policy page (`/shipping`)
- [x] Footer links to all legal pages
