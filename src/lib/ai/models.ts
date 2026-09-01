import { openai } from "@ai-sdk/openai";

/** Default OpenAI model for chat, search specialist, and background jobs. */
export const OPENAI_CHAT_MODEL = "gpt-5-nano";

/** Vision model for premium receipt / bill OCR. */
export const OPENAI_RECEIPT_MODEL = "gpt-5-mini";

export const chatModel = () => openai(OPENAI_CHAT_MODEL);

export const receiptModel = () => openai(OPENAI_RECEIPT_MODEL);
