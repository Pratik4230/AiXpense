import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { effectivePremium } from "@/lib/premium";

export const maxDuration = 120;
const OPENAI_IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";

type GenerateImageRequest = {
  insightContent: string;
  periodKey: string;
  totalSpent: number;
  currencyCode?: string;
  currencySymbol?: string;
};

const SOCIAL_CAPTION_TEMPLATES = [
  "Grand spender energy, now with smarter choices. {period} wrap: {amount}. #AIxPense #MoneyMindset",
  "Spending glow-up unlocked. In {period}, I tracked {amount} and got coached by AI. #Aixpense #FinanceGoals",
  "Money check-in complete: {amount} in {period}. Small wins, big discipline. #SpendSmart #Aixpense",
  "My AI spending coach just roasted and helped me in {period}. Total: {amount}. #PersonalFinance #Aixpense",
  "A little mindful, a little savage - {period} spend was {amount}. Coach says I can do better. #Aixpense",
];

function formatAmount(
  totalSpent: number,
  currencyCode?: string,
  currencySymbol?: string,
) {
  if (!Number.isFinite(totalSpent)) return `${currencySymbol ?? ""}0`;
  if (currencyCode) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(totalSpent);
  }
  return `${currencySymbol ?? ""}${Math.round(totalSpent).toLocaleString("en")}`;
}

function buildCaption(amount: string, periodKey: string) {
  const randomTemplate =
    SOCIAL_CAPTION_TEMPLATES[
      Math.floor(Math.random() * SOCIAL_CAPTION_TEMPLATES.length)
    ];
  const period = periodKey.replaceAll("-", " ");
  return randomTemplate.replace("{amount}", amount).replace("{period}", period);
}

function buildPrompt({
  insightContent,
  periodKey,
  totalSpent,
  currencyCode,
  currencySymbol,
}: GenerateImageRequest) {
  const amount = formatAmount(totalSpent, currencyCode, currencySymbol);
  const period = periodKey.replaceAll("-", " ");

  return `Create an Instagram-ready 1:1 finance summary social card for a product called Aixpense.
Style: minimal and premium, elegant, editorial, clean, modern, tasteful color palette.
Primary goal: make the card feel classy and share-worthy.

Card content requirements:
- Use a short refined headline with a playful finance nickname like "Grand Spender", "Budget Ninja", "Money Maverick", or similar.
- Show this period clearly: "${period}".
- Show this spend amount clearly: "${amount}".
- Include one concise AI coach insight based on: "${insightContent}".
- Add one short next action line.

Layout constraints:
- Keep a clear safe area at top-left (at least 120x120 px) for a small logo overlay.
- Keep a clear safe area at bottom-right for a small website watermark text overlay.
- Do not include brand logo or website text in the generated image (they will be overlaid later).
- Keep text readable, balanced, and sparse.
- Avoid dense paragraphs.
- Avoid 3D objects, mascots, shopping bags, burgers, coffee cups, emojis, crowns, neon overload.
- Prefer flat graphic motifs, subtle gradients, ample negative space, and premium typography hierarchy.

Output requirements:
- 1024x1024 square composition.
- No human faces.
- No financial institution logos.
- No spelling mistakes.`;
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const dbUser = await mongoose.connection
    .db!.collection("user")
    .findOne(
      { _id: new mongoose.Types.ObjectId(session.user.id) },
      { projection: { isPremium: 1 } },
    );
  const isPremium = effectivePremium({
    isPremium: dbUser?.isPremium as boolean | undefined,
  });
  if (!isPremium) {
    return NextResponse.json(
      { error: "Image generation is available for Premium users only." },
      { status: 403 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing." },
      { status: 500 },
    );
  }

  const body = (await req.json()) as Partial<GenerateImageRequest>;
  if (
    !body.insightContent ||
    !body.periodKey ||
    typeof body.totalSpent !== "number"
  ) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const prompt = buildPrompt({
    insightContent: body.insightContent,
    periodKey: body.periodKey,
    totalSpent: body.totalSpent,
    currencyCode: body.currencyCode,
    currencySymbol: body.currencySymbol,
  });

  let base64Image = "";
  try {
    const upstream = await fetch(OPENAI_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
        size: "1024x1024",
      }),
    });

    if (!upstream.ok) {
      const errBody = await upstream.text();
      return NextResponse.json(
        {
          error: "Image generation request failed.",
          details: process.env.NODE_ENV === "production" ? undefined : errBody,
        },
        { status: 502 },
      );
    }

    const json = (await upstream.json()) as { data?: Array<{ b64_json?: string }> };
    base64Image = json.data?.[0]?.b64_json ?? "";
    if (!base64Image) {
      return NextResponse.json(
        {
          error: "Image generation failed. No image output returned.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Image generation request failed.",
        details: process.env.NODE_ENV === "production" ? undefined : message,
      },
      { status: 502 },
    );
  }

  const amount = formatAmount(
    body.totalSpent,
    body.currencyCode,
    body.currencySymbol,
  );
  const caption = buildCaption(amount, body.periodKey);

  return NextResponse.json({
    imageDataUrl: `data:image/png;base64,${base64Image}`,
    caption,
  });
}
