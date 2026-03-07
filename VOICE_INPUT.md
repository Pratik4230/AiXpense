# Voice Input — Architecture & Implementation

## What We Built

A fully custom, hands-free voice expense entry system. The user taps a mic button, speaks in any Indian language (Hindi, Marathi, Hinglish, Tamil, etc.), and the expense is automatically transcribed and submitted to the AI pipeline — no typing required.

---

## Architecture

```
Browser (MediaRecorder + AudioContext)
  └── POST /api/voice  (Next.js API route)
        └── Sarvam AI  saaras:v3  (speech-to-text)
              └── transcript string
                    └── auto-fills ChatInput → auto-submits to AI pipeline
```

---

## Tech Stack & Decisions

### STT Provider: Sarvam AI (saaras:v3)

Chose Sarvam over OpenAI Whisper because:
- Purpose-built for Indian languages — 22 Indian languages natively
- Explicit code-mixing support (Hinglish, Marathi+Hindi+English in one sentence)
- ₹30/hour (~$0.35/hr) — same price as Whisper but far better Indian language accuracy
- `codemix` mode preserves mixed-script output naturally

### No Vercel AI SDK for Transcription

AI SDK's `experimental_transcribe` doesn't support Sarvam (no official provider). Direct `fetch` to Sarvam REST API in a Next.js route handler is cleaner, lighter, and has no abstraction overhead.

### Backend Route (not client-side fetch)

`SARVAM_API_KEY` lives only on the server. Android app (future) posts audio to the same `/api/voice` route — zero backend changes needed for mobile.

---

## Key Implementation Details

### `src/app/api/voice/route.ts`

- Receives audio as `FormData` (binary — can't use JSON for files)
- Forwards to `https://api.sarvam.ai/speech-to-text` with `model: saaras:v3`, `mode: codemix`
- Guards: null check for audio file, `response.ok` check for Sarvam errors
- Returns `{ transcript: string }`

### `src/hooks/useSarvamSTT.ts`

Custom React hook owning all recording state. Three layers:

**1. MediaRecorder** — browser-native audio recording in `webm/opus` format. Chunks buffer in a `useRef` (not state) to avoid unnecessary re-renders.

**2. AudioContext + AnalyserNode** — silence detection. Measures avg frequency amplitude (0-255) every animation frame:
- Threshold: `20` (background noise ~5-15, speech ~30+)
- Silence duration: `800ms` auto-stop (after speech is first detected)
- Same as Google Voice Search UX

**3. Noise suppression via getUserMedia constraints**:
```ts
{ noiseSuppression: true, echoCancellation: true, autoGainControl: true }
```
Browser/OS-level filtering — no DSP library needed.

**Stop paths**: Both silence-detected auto-stop and manual mic click route through the same `onstop` handler → `sendAudio()` → transcript → auto-submit.

### `src/components/chat/ChatInput.tsx`

Auto-submit uses a `useRef` flag to bridge React's async state updates:
1. Transcript arrives → `shouldAutoSubmitRef.current = true` → `onChange(transcript)`
2. `value` prop updates → `useEffect([value])` fires → if flag set → `handleSubmit()`

This avoids submitting stale state (a common React controlled component pitfall).

---

## Flow Diagram

```
User taps mic
  → getUserMedia (with noiseSuppression, echoCancellation, autoGainControl)
  → MediaRecorder.start()
  → AudioContext + AnalyserNode starts silence monitoring

User speaks
  → speechDetected = true
  → chunks accumulate in ref

User stops speaking
  → silence > 800ms  OR  user taps mic again
  → MediaRecorder.stop() → onstop fires
  → stopSilenceDetection() (cancel rAF + timers + close AudioContext)
  → mic released (red browser dot disappears)

sendAudio()
  → Blob assembled from chunks
  → POST /api/voice (FormData)
  → Sarvam saaras:v3 (codemix mode)
  → transcript returned

ChatInput
  → onChange(transcript) fills input
  → shouldAutoSubmitRef → handleSubmit() auto-fired
  → existing AI pipeline processes transcript
```

---

## Multi-language Support

Sarvam saaras:v3 auto-detects language — no `language_code` param needed. Handles:
- Pure Hindi: `"आज petrol भरा 500"`
- Hinglish: `"aaj petrol bhara 500 rupaye"`
- Marathi+Hindi: `"aaj petrol bhara 800, aani lunch la 200 gela"`
- English: `"spent 500 on petrol today"`

GPT system prompt explicitly states support for all Indian languages + Hinglish.

---

## Future Android Compatibility

Android app posts audio binary to the same `POST /api/voice` route. Zero backend changes. Only the recording mechanism changes (Android uses `MediaRecorder` Java API instead of browser API, but the HTTP call is identical).

---

## Resume Points

- Built a **custom voice-to-expense pipeline** using Sarvam AI (saaras:v3) supporting 22 Indian languages and Hinglish code-mixing
- Implemented **browser-native silence detection** using `AudioContext` + `AnalyserNode` with 800ms auto-stop threshold — no external VAD library
- Applied **hardware-level noise suppression** via `getUserMedia` constraints (`noiseSuppression`, `echoCancellation`, `autoGainControl`)
- Designed a **backend-proxied STT architecture** keeping API keys server-side and ensuring Android app compatibility via the same REST endpoint
- Solved React controlled component **async state bridging** for auto-submit using `useRef` flag pattern
