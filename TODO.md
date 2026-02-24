# AiXpense - AI Improvements TODO

Sorted from easiest to hardest. Complete in order.

---

## EASY

- [x] **textVerbosity: "low"** — Add `providerOptions.openai.textVerbosity: "low"` to `streamText` in `/api/chat/route.ts` to enforce concise responses globally and reduce tokens.

- [x] **user identifier** — Pass `user: userId` in `providerOptions.openai` in `/api/chat/route.ts` so OpenAI can monitor/detect abuse per user.

- [x] **safetyIdentifier** — Pass `safetyIdentifier: userId` in `providerOptions.openai` for OpenAI policy enforcement.

- [x] **maxToolCalls provider option** — Add `maxToolCalls: 5` in `providerOptions.openai` alongside `stopWhen: stepCountIs(5)` for OpenAI-side enforcement as a safety net.

- [x] **Downgrade specialist model** — In `searchTransactions.ts`, change specialist agent model from `gpt-5.1` to `gpt-4.1-nano`. The specialist only converts NL to MongoDB filters — a nano model is sufficient and much cheaper.

---

## MEDIUM

- [ ] **promptCacheKey on specialist agent** — Add `promptCacheKey` + `promptCacheRetention: "24h"` in `providerOptions.openai` for the `generateText` call in `searchTransactions.ts`. The `SPECIALIST_SYSTEM_PROMPT` is static and large — caching it saves cost and latency.

- [ ] **Structured output for specialist agent** — Replace manual `JSON.parse()` + markdown stripping in `searchTransactions.ts` with `generateObject` + Zod schema using `Output.object()`. Eliminates brittle parsing.

- [ ] **WebSocket transport** — Install `ai-sdk-openai-websocket-fetch`, pass `createWebSocketFetch()` to `createOpenAI({ fetch: wsFetch })` in `/api/chat/route.ts`. Reduces TTFB on multi-step tool calls.

- [ ] **serviceTier: "flex" for specialist agent** — Use `serviceTier: "flex"` on the specialist `generateText` in `searchTransactions.ts`. Non-real-time query generation = 50% cost saving acceptable latency tradeoff.

---

## HARD

- [ ] **Voice input / Whisper transcription** — Add microphone button to `ChatInput.tsx`. Record audio → POST to new `/api/transcribe` route using `openai.transcription("whisper-1")` → inject transcribed text into chat input. Huge UX win.

- [ ] **Receipt image scanning** — Add image attachment button in `ChatInput.tsx`. Pass image as `UIMessage` content part (type: "image") to `/api/chat/route.ts`. The model reads the receipt and auto-calls `saveExpense` with extracted item/amount/category.

- [ ] **previousResponseId for stateful sessions** — Use `previousResponseId` from `providerMetadata.openai.responseId` to continue conversations server-side instead of resending full message history. Reduces token payload per request significantly.

- [ ] **PDF bank statement import** — Add "Upload Statement" feature (premium only). User uploads a PDF → POST to `/api/import-statement` → model parses it with PDF input support → bulk-calls `saveExpense`/`saveIncome` for each transaction.
