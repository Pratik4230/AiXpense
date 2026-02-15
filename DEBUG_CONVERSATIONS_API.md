# Conversations API Debugging Guide

## Issue

The `/api/conversations` endpoint fails on production (https://www.aixpense.in) even when no conversations exist yet.

## Changes Made

### 1. Route Configuration (`/src/app/api/conversations/route.ts`)

Added Next.js route segment config to prevent timeout issues:

```typescript
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
```

### 2. Comprehensive Logging

Added detailed console.log statements at every step:

**GET Endpoint Logs:**

- Request received
- Session retrieval
- Session validation (hasSession, hasUser, userId)
- DB connection status
- Query execution
- Results count
- Error details with stack trace

**POST Endpoint Logs:**

- Request received
- Session retrieval
- Session validation
- Request body
- DB connection status
- Conversation creation
- Success confirmation
- Error details with stack trace

### 3. Error Handling

Added try-catch blocks with:

- Detailed error messages
- Error stack traces
- 500 status responses with error details

### 4. Similar Changes to Dynamic Route

Applied same improvements to `/src/app/api/conversations/[id]/route.ts`

## How to Debug on Production

### Step 1: Deploy Changes

1. Commit and push changes to your repository
2. Vercel will auto-deploy
3. Wait for deployment to complete

### Step 2: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Logs
2. Open the app at https://www.aixpense.in/aixpense
3. Watch the real-time logs in Vercel

### Step 3: Look for These Log Patterns

**Successful Request:**

```
[Conversations GET] Request received
[Conversations GET] Getting session...
[Conversations GET] Session: { hasSession: true, hasUser: true, userId: '...' }
[Conversations GET] Connecting to DB...
[Conversations GET] DB connected
[Conversations GET] Fetching conversations for user: ...
[Conversations GET] Found conversations: 0
```

**Common Failure Patterns:**

**Pattern 1: Auth Issue**

```
[Conversations GET] Request received
[Conversations GET] Getting session...
[Conversations GET] Session: { hasSession: false, hasUser: false, userId: undefined }
[Conversations GET] Unauthorized - no user ID
```

→ **Fix**: Check `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` in Vercel env vars

**Pattern 2: Database Connection**

```
[Conversations GET] Request received
[Conversations GET] Getting session...
[Conversations GET] Session: { hasSession: true, hasUser: true, userId: '...' }
[Conversations GET] Connecting to DB...
[Conversations GET] Error: ...
```

→ **Fix**: Check `MONGO_URI` in Vercel env vars and MongoDB Atlas network access

**Pattern 3: Model/Schema Issue**

```
[Conversations GET] DB connected
[Conversations GET] Fetching conversations for user: ...
[Conversations GET] Error: ...
```

→ **Fix**: Check if Conversation model is exported correctly

### Step 4: Browser Network Tab

1. Open browser DevTools → Network tab
2. Navigate to `/aixpense`
3. Look for the request to `/api/conversations`
4. Check:
   - Status code (401, 500, etc.)
   - Response body for error details
   - Request headers (cookies for auth)

## Environment Variables to Verify on Vercel

Make sure these are set:

- `NEXT_PUBLIC_APP_URL` = `https://www.aixpense.in` ✓ (already confirmed)
- `BETTER_AUTH_URL` = `https://www.aixpense.in`
- `BETTER_AUTH_SECRET` = (your secret)
- `MONGO_URI` = (your MongoDB connection string)

## Local Testing

Works fine locally, which suggests:

1. Environment variable mismatch between local and production
2. Network/firewall issue on Vercel → MongoDB
3. Auth configuration issue specific to production domain

## Next Steps

1. Deploy these changes
2. Check Vercel logs for the detailed console output
3. Share the log output to identify exact failure point
