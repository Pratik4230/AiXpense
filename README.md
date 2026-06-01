# AiXpense

AI-powered expense tracker for India. Track income and expenses by just typing or speaking naturally. No forms, no dropdowns.

Live at **[aixpense.in](https://aixpense.in)**

## What it does

AiXpense is a chat-based personal finance app. You tell the AI what you spent and it handles everything else.

```
"Uber to airport 650"         → saves ₹650 under Transport
"Zomato dinner 450"           → saves ₹450 under Food & Dining
"received salary 50000"       → saves ₹50,000 as Income
"how much did I spend on food this month?" → instant summary
```

The AI extracts the item, amount, category, subcategory, tags, and date automatically. No manual entry. No categories to configure.

## Features

| Feature                | Details                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Natural language input | Type in English, Hindi, Marathi, Hinglish, or any of 22+ Indian languages          |
| Voice input            | Powered by Sarvam AI's `saaras:v3` model. Speak and log instantly                  |
| Bill scan              | Snap a bill photo, AI extracts merchant and amount (coming soon)                   |
| Smart categorization   | Food, Transport, Rent, EMI, Subscriptions, Health and more. Inferred automatically |
| Budget tracking        | Set monthly budgets per category, get alerts when nearing the limit                |
| Analytics              | Monthly trends, category-wise charts, spending insights                            |
| Transaction history    | Search, filter, edit, and delete past entries via chat                             |

## Pricing

| Plan            | Price         | Limit                     |
| --------------- | ------------- | ------------------------- |
| Free            | ₹0            | 7 AI messages / day       |
| Premium Monthly | ₹499 / month  | Unlimited                 |
| Premium Yearly  | ₹4,000 / year | Unlimited + 2 months free |

Payments via Razorpay. Cancel anytime.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI**: OpenAI `gpt-5-nano` via Vercel AI SDK
- **Voice**: Sarvam AI `saaras:v3` (22+ Indian languages)
- **Auth**: Better Auth (Google, GitHub, Email OTP)
- **Database**: MongoDB (native driver)
- **Payments**: Razorpay Subscriptions
- **Email**: Inngest background jobs
- **Deployment**: Vercel

## Local Development

```bash
# Install dependencies
bun install

# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## E2E tests (Playwright)

```bash
bunx playwright install chromium
# Add to .env:
# E2E_TEST_EMAIL=...   (verified test user)
# E2E_TEST_PASSWORD=...
bun run test:e2e
bun run test:e2e:ui   # visual debugger
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (protected)/     # Chat, profile, budgets, reports, transactions
│   ├── api/             # API routes (chat, razorpay, user, inngest)
│   └── page.tsx         # Public landing page
├── components/
│   ├── chat/            # ChatView, ChatInput, TrialStatus, message cards
│   ├── profile/         # Plan, usage, danger zone cards
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── ai/              # Tools (saveExpense, saveIncome, search, delete, update)
│   ├── auth.ts          # Better Auth config
│   └── db.ts            # MongoDB connection
├── models/              # Mongoose models (Subscription, etc.)
├── services/            # TanStack Query hooks (conversations, trials, etc.)
└── inngest/             # Background jobs (AI spending coach emails)
```

## Free Trial System

Free users get **7 AI messages per day**, resetting at midnight IST. The reset is handled atomically in the `/api/chat` route using a MongoDB aggregation pipeline. No cron job required. The UI shows an optimistic count immediately and confirms against the server after each response.

Built by [Pratik Jadhav](https://linkedin.com/in/pratikjadhav1438) · [Twitter/X](https://x.com/Pratik4230)
