import { tool } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { logger } from "@/lib/logger";

const EXTRACTION_PROMPT = `You are a bill parser for an Indian expense tracker.
Look at this bill/receipt image and extract ONE expense summary as a short natural language sentence, optionally followed by a line item breakdown in parentheses.

Rules:
- Identify the merchant/store name (e.g. DMart, Raju Kirana Store, Haryana Roadways)
- Find the TOTAL/Grand Total/कुल देय राशि amount in INR
- Extract the date if visible, output as DD Month YYYY (e.g. 26 January 2018). If year is not on the bill, omit it.
- Output ONLY one sentence. If line items and taxes (like dishes, products, CGST, SGST, IGST, VAT, service charges, delivery fees) are clearly readable, append them in parentheses to serve as notes. Format as a comma-separated list.
- **CRITICAL**: For EVERY single item in the parentheses, you MUST include its price/amount right next to it with the ₹ symbol. Never list an item or a tax without its price.
- Example 1 (with items and taxes): "Anandha Bhavan meal ₹404 on 26 January 2018 (1 Ghee Pongal ₹50, 3 Vadai ₹60, 3 Roast ₹150, 2 Poori Masal ₹100, 1 Tea ₹25, 2.5% CGST ₹9.63, 2.5% SGST ₹9.63, Rounding -₹0.26)"
- Example 2 (no clear items): "Swiggy order ₹320"
- For bills in Hindi/Marathi/any Indian language, still output in English
- Use the TOTAL amount, not individual line items for the main amount
- Use ₹ symbol for all amounts
- If you genuinely cannot read any amount, output exactly: "Bill scan — please enter amount manually"`;

export const createScanBillTool = ({
  isPremium = false,
}: { isPremium?: boolean } = {}) =>
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
        console.log("its called : ", imageUrl);
        // Fetch the image from URL to pass to Gemini
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error("Failed to fetch image");

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { text } = await generateText({
          model: google("gemini-3.1-flash-lite-preview"),
          system: EXTRACTION_PROMPT,
          maxOutputTokens: 1200,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  image: buffer,
                },
              ],
            },
          ],
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
