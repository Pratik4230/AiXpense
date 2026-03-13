import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";
import { google, type GoogleLanguageModelOptions } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];

const SAFE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const EXTRACTION_PROMPT = `You are a bill parser for an Indian expense tracker.
Look at this bill/receipt image and extract ONE expense summary as a short natural language sentence.

Rules:
- Identify the merchant/store name (e.g. DMart, Raju Kirana Store, Haryana Roadways)
- Find the TOTAL/Grand Total/कुल देय राशि amount in INR
- Find the date if visible. The date on the bill can be in any format (DD/MM/YY, MM/DD/YYYY, YYYY-MM-DD, DD-MON-YY, or any other). Interpret it correctly and always output it as: DD Month YYYY (e.g. 26 January 2018). If year is not on the bill, omit it.
- Output ONLY one sentence, examples:
  "DMart groceries ₹843 on 10 March 2024"
  "Raju Kirana Store ₹402 on 12 October 2023"
  "Haryana Roadways bus ticket ₹160 on 12 October"
  "Swiggy order ₹320"
- For bills in Hindi/Marathi/any Indian language, still output in English
- Use the TOTAL amount, not individual line items
- Use ₹ symbol
- If you genuinely cannot read any amount, output exactly: "Bill scan — please enter amount manually"`;

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const dbUser = await db
    .collection("user")
    .findOne({ _id: new ObjectId(userId) }, { projection: { isPremium: 1 } });

  if (!dbUser?.isPremium) {
    logger.warn("ocr_premium_required", { userId });
    return Response.json(
      { error: "Bill scan is a Premium feature" },
      { status: 403 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return Response.json({ error: "No file received" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    if (!ALLOWED_EXTS.includes(ext)) {
      return Response.json(
        { error: "Use JPG, PNG, WebP, or PDF" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length > MAX_BYTES) {
      return Response.json(
        { error: "File too large — max 4MB" },
        { status: 400 },
      );
    }

    const rawMime = file.type || "";
    const mimeType = (
      SAFE_MIME_TYPES.has(rawMime) ? rawMime : "image/jpeg"
    ) as `image/${string}` | "application/pdf";

    const { text } = await generateText({
      model: google("gemini-3.1-flash-lite-preview"),
      system: EXTRACTION_PROMPT,
      maxOutputTokens: 500,
      providerOptions: {
        google: {
          thinkingConfig: { thinkingLevel: "medium" },
          mediaResolution: "MEDIA_RESOLUTION_MEDIUM",
        } satisfies GoogleLanguageModelOptions,
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: buffer,
              mediaType: mimeType,
            },
          ],
        },
      ],
    });

    logger.info("ocr_complete", {
      userId,
      data: { model: "gemini-3.1-flash-lite-preview" },
    });
    return Response.json({ text: text.trim() });
  } catch (error) {
    logger.error("ocr_fail", { userId, error });
    return Response.json({ error: "Bill scan failed" }, { status: 500 });
  }
}
