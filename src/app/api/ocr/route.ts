import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import JSZip from "jszip";

export const maxDuration = 60;

const SARVAM_BASE = "https://api.sarvam.ai";
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 20;

async function pollJobStatus(jobId: string): Promise<string> {
  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await fetch(
      `${SARVAM_BASE}/document-intelligence/jobs/${jobId}`,
      {
        headers: { "api-subscription-key": process.env.SARVAM_API_KEY! },
      },
    );

    if (!res.ok) throw new Error(`Poll failed: ${res.status}`);
    const data = await res.json();

    if (data.job_state === "COMPLETED") return jobId;
    if (data.job_state === "FAILED") throw new Error("Sarvam job failed");
  }
  throw new Error("OCR job timed out");
}

async function downloadResult(jobId: string): Promise<string> {
  const res = await fetch(
    `${SARVAM_BASE}/document-intelligence/jobs/${jobId}/download`,
    {
      headers: { "api-subscription-key": process.env.SARVAM_API_KEY! },
    },
  );

  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const buffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  let text = "";
  for (const [, file] of Object.entries(zip.files)) {
    if (
      !file.dir &&
      (file.name.endsWith(".md") || file.name.endsWith(".html"))
    ) {
      text += await file.async("string");
    }
  }
  return text.trim();
}

async function parseOcrToExpenseText(ocrText: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-5-mini"),
    messages: [
      {
        role: "system",
        content: `You are a bill parser for an Indian expense tracker.
Given raw OCR text from a bill/receipt, extract ONE expense summary as a short natural language sentence.

Rules:
- Identify the merchant/store name
- Find the TOTAL/Grand Total amount (in INR)
- Find the date if present (format: DD Month)
- Output ONLY one sentence like: "DMart groceries ₹843 on 10 March" or "Swiggy order ₹320"
- If no clear total found, use the largest amount on the bill
- Use ₹ symbol for amounts
- If the bill is in Hindi/regional language, still output in English
- Do NOT include line items, just the total
- If you cannot determine any amount, output: "Bill scan — please enter amount manually"`,
      },
      {
        role: "user",
        content: `Bill OCR text:\n\n${ocrText.slice(0, 3000)}`,
      },
    ],
  });
  return text.trim();
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file received" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowedExts = ["pdf", "png", "jpg", "jpeg"];
    if (!allowedExts.includes(ext)) {
      return Response.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const createRes = await fetch(`${SARVAM_BASE}/document-intelligence/jobs`, {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: "hi-IN", output_format: "md" }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Create job failed: ${createRes.status} ${err}`);
    }

    const { job_id: jobId } = await createRes.json();

    const uploadForm = new FormData();
    uploadForm.append("file", file, file.name);

    const uploadRes = await fetch(
      `${SARVAM_BASE}/document-intelligence/jobs/${jobId}/upload`,
      {
        method: "POST",
        headers: { "api-subscription-key": process.env.SARVAM_API_KEY! },
        body: uploadForm,
      },
    );

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

    const startRes = await fetch(
      `${SARVAM_BASE}/document-intelligence/jobs/${jobId}/start`,
      {
        method: "POST",
        headers: { "api-subscription-key": process.env.SARVAM_API_KEY! },
      },
    );

    if (!startRes.ok) throw new Error(`Start job failed: ${startRes.status}`);

    await pollJobStatus(jobId);
    const ocrText = await downloadResult(jobId);

    if (!ocrText) {
      return Response.json({
        text: "Bill scan — please enter amount manually",
      });
    }

    const expenseText = await parseOcrToExpenseText(ocrText);

    logger.info("ocr_complete", { userId, data: { jobId } });
    return Response.json({ text: expenseText });
  } catch (error) {
    logger.error("ocr_fail", { userId, error });
    return Response.json({ error: "Bill scan failed" }, { status: 500 });
  }
}
