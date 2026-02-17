# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AiXpense is an AI-powered expense tracker that lets users log expenses/incomes via natural language chat. Built with Next.js 16 App Router, React 19, TypeScript, MongoDB, and Vercel AI SDK.

## Commands

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Run production build
bun lint         # Run ESLint (eslint-config-next)
```

Scripts in `scripts/`:
- `createRazorpayPlans.ts` - Create Razorpay subscription plans
- `reset-trials.ts` - Reset user free trial counts

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
  - `(auth)/` - Auth pages (login, signup, forgot-password, verify-email)
  - `(protected)/` - Authenticated pages (aixpense chat, profile, premium)
  - `api/chat/` - AI chat endpoint (streaming responses)
  - `api/conversations/` - CRUD for conversation history
  - `api/razorpay/` - Payment subscription webhooks
- `src/components/` - React components organized by domain
  - `ui/` - shadcn/ui primitives
  - `chat/` - Chat interface components
  - `profile/`, `auth/`, `layout/` - Feature components
- `src/lib/` - Shared utilities and core logic
  - `ai/tools/` - AI tool implementations
  - `models/` - Mongoose schemas (Expense, Budget, Conversation)
  - `constants/` - Shared enums and prompts
- `src/services/` - React Query hooks for API calls
- `src/models/` - Additional Mongoose schemas (Subscription)

### Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json)

### AI Architecture

The chat system uses a **two-tier agent pattern**:

1. **Main Agent** (`api/chat/route.ts`): Handles user messages, routes to appropriate tools
2. **Specialist Agent** (inside `searchTransactions` tool): Converts natural language to MongoDB queries using a separate LLM call

AI tools use a **factory pattern** that injects user context:
```typescript
// Tools are created per-request with user context
createSaveExpenseTool({ userId, rawInput })
createSearchTransactionsTool({ userId, currentDate })
```

Available tools: `saveExpense`, `saveIncome`, `searchTransactions`, `deleteTransaction`, `updateTransaction`

### Data Models

**Expense** (used for both expenses and incomes):
- `userId`, `item`, `amount`, `category`, `type` ("expense" | "income"), `date`, `rawInput`
- Categories defined in `src/lib/constants/expense.ts`

**Conversation**: Stores chat history with `messages` array and `messageCount`

**Subscription**: Razorpay subscription state (plan, status, period dates)

### Authentication

Uses `better-auth` with MongoDB adapter. User model includes:
- `isPremium: boolean` - Premium subscription status
- `freeTrials: number` - Remaining free AI interactions (default 5)

Auth client: `src/lib/authClient.ts` (React hooks)
Auth server: `src/lib/auth.ts` (API configuration)

### State Management

- **Server state**: React Query (`@tanstack/react-query`) via hooks in `src/services/`
- **AI chat state**: Vercel AI SDK's `useChat` hook
- **Providers**: `ThemeProvider` (next-themes), `QueryProvider` (React Query)

## Key Conventions

- Currency is INR (₹) throughout the app
- Dates use IST (Indian Standard Time) for user-facing logic
- UI components from shadcn/ui are in `src/components/ui/`
- Mongoose models check `mongoose.models` before creating to prevent hot-reload issues
