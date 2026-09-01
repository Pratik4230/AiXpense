import { tool } from "ai";
import { z } from "zod";
import { receiptModel } from "@/lib/ai/models";
import { generateText } from "ai";
import { logger } from "@/lib/logger";
import { DEFAULT_CURRENCY, getCurrency } from "@/constants/currency";

function buildExtractionPrompt(currencyCode: string, currencySymbol: string) {
  return `You are a document parser for a personal expense tracker.
Look at this image and extract ONE summary as a short natural language sentence, optionally followed by a breakdown in parentheses.

Rules:
- Identify if the document is an Expense (bill/receipt) or an Income (salary slip/refund).
- Identify the merchant/store/company name (e.g. DMart, TCS, local store).
- Find the TOTAL/Grand Total/Net Pay amount. Prefer the currency shown on the document; if unclear, assume the user's account currency ${currencyCode}.
- Extract the date if visible, output as DD Month YYYY (e.g. 26 January 2018). If year is not on the bill, omit it.
- Output ONLY one sentence starting with either "Expense:" or "Income:" based on the document type.
- If line items and taxes (VAT, GST, CGST, SGST, sales tax, service charges, delivery fees, or salary components like Basic, HRA, PF) are clearly readable, append them in parentheses to serve as notes. Format as a comma-separated list.
- **CRITICAL**: For EVERY single item in the parentheses, you MUST include its price/amount right next to it with the same currency symbol used on the document, or ${currencySymbol} when the document matches ${currencyCode}.
- Example 1 Expense: "Expense: Cafe meal ${currencySymbol}404 on 26 January 2018 (1 Item A ${currencySymbol}50, 2 Item B ${currencySymbol}60, Tax ${currencySymbol}9.63)"
- Example 2 Expense: "Expense: Food delivery ${currencySymbol}320"
- Example 3 Income: "Income: Salary from Acme ${currencySymbol}45000 on 30 October 2023 (Basic ${currencySymbol}20000, Bonus ${currencySymbol}5000)"
- For documents in any language, still output merchant/description in English when possible
- Use the TOTAL amount, not individual line items for the main amount
- If you genuinely cannot read any amount, output exactly: "Document scan. Please enter amount manually"`;
}

const fallbackCurrency = getCurrency(DEFAULT_CURRENCY);

export const createScanBillTool = ({
  isPremium = false,
  currencyCode = DEFAULT_CURRENCY,
  currencySymbol = fallbackCurrency.symbol,
}: {
  isPremium?: boolean;
  currencyCode?: string;
  currencySymbol?: string;
} = {}) =>
  tool({
    description: "Read and extract details from a receipt or bill image URL.",
    inputSchema: z.object({
      imageUrl: z.string().describe("The URL of the bill image to scan"),
    }),
    execute: async ({ imageUrl }) => {
      if (!isPremium) {
        return {
          success: false,
          error:
            "OCR bill scanning requires a Premium subscription. Please upgrade.",
        };
      }
      try {
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error("Failed to fetch image");

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mediaType =
          res.headers.get("content-type")?.split(";")[0]?.trim() ??
          "image/jpeg";

        const documentPart =
          mediaType === "application/pdf"
            ? ({ type: "file" as const, data: buffer, mediaType })
            : ({ type: "image" as const, image: buffer, mediaType });

        const { text } = await generateText({
          model: receiptModel(),
          system: buildExtractionPrompt(currencyCode, currencySymbol),
          maxOutputTokens: 1200,
          messages: [
            {
              role: "user",
              content: [documentPart],
            },
          ],
          providerOptions: {
            openai: {
              reasoningEffort: "medium",
              store: false,
            },
          },
        });

        return {
          success: true,
          extractedText: text.trim(),
        };
      } catch (err) {
        logger.error("ocr_fail", { error: err });
        return {
          success: false,
          error:
            "Failed to scan bill. Please try downloading or entering manually.",
        };
      }
    },
  });
