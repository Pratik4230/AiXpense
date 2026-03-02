# AiXpense - AI Improvements TODO

Sorted from easiest to hardest. Complete in order.

---

## TOP PRIORITY

- [ ] **Remove manual memoization across entire app** — React 19 + React Compiler handles memoization automatically. Strip all `useMemo`, `useCallback`, and `React.memo`/`memo()`. They are redundant. `useRef` and `useState` should stay.

---

## EASY

- [x] **textVerbosity: "low"** — Add `providerOptions.openai.textVerbosity: "low"` to `streamText` in `/api/chat/route.ts`.

- [x] **user identifier** — Pass `user: userId` in `providerOptions.openai` in `/api/chat/route.ts`.

- [x] **safetyIdentifier** — Pass `safetyIdentifier: userId` in `providerOptions.openai`.

- [x] **maxToolCalls provider option** — Add `maxToolCalls: 5` in `providerOptions.openai`.

- [x] **Downgrade specialist model** — Specialist agent now uses `gpt-5-nano`.

- [x] **truncation: "auto"** — Prevents 400 errors on long conversations; OpenAI drops oldest messages instead of failing.

- [x] **store: false** — Stops OpenAI from storing sensitive financial conversation data on their platform.

---

## MEDIUM

- [x] **promptCacheKey on specialist agent** — `promptCacheKey: "specialist-system-v1"` caches the large static `SPECIALIST_SYSTEM_PROMPT` across all users (10x cheaper on cache hits).

- [x] **serviceTier: "flex" on specialist** — 50% cost reduction on specialist `generateText`. Latency tradeoff is invisible since user sees a loading spinner anyway.

- [ ] **Structured output for specialist agent** — Replace `JSON.parse()` + markdown stripping with `generateObject` + Zod schema. Skip unless parsing failures appear in production.

- [x] **WebSocket transport** — Skipped.

---

## HARD

- [ ] **Voice input / Whisper transcription** — Microphone button in `ChatInput.tsx` → record audio → `/api/transcribe` → inject transcribed text.

- [ ] **Receipt image scanning** — Image attachment in `ChatInput.tsx` → pass as `type: "image"` content → model auto-calls `saveExpense`.

- [ ] **previousResponseId for stateful sessions** — Use `responseId` from `providerMetadata.openai.responseId` to avoid resending full message history each turn.

- [ ] **PDF bank statement import** — Upload PDF → parse all transactions → bulk-insert via `saveExpense`/`saveIncome`. Premium-only feature.
