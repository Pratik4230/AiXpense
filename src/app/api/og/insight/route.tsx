import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Insight } from "@/models";
import mongoose from "mongoose";

export const runtime = "nodejs";

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getPeriodLabel(periodKey: string) {
  if (periodKey.startsWith("week-")) {
    const date = new Date(periodKey.replace("week-", ""));
    return `Week of ${date.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`;
  }
  if (periodKey.startsWith("month-")) {
    const [year, month] = periodKey.replace("month-", "").split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  return periodKey;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const insightId = searchParams.get("id");

  if (!insightId) {
    return new Response("Missing id", { status: 400 });
  }

  await connectDB();

  const insight = await Insight.findById(
    new mongoose.Types.ObjectId(insightId),
  ).lean();

  if (!insight) {
    return new Response("Not found", { status: 404 });
  }

  const period = getPeriodLabel(insight.periodKey);
  const amount = fmt(insight.totalSpent);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          background: "linear-gradient(135deg, #1c0a00 0%, #2d1200 40%, #1a0800 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at top right, rgba(180,83,9,0.15) 0%, transparent 60%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #b45309, #f59e0b)",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "24px" }}>✦</span>
          </div>
          <span style={{ color: "#f59e0b", fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            AiXpense
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "48px" }}>
          <span style={{ color: "#92400e", fontSize: "20px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
            {period}
          </span>
          <span style={{ color: "#fef3c7", fontSize: "88px", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1 }}>
            {amount}
          </span>
          <span style={{ color: "#78716c", fontSize: "22px", marginTop: "8px" }}>total spent</span>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(180,83,9,0.3)",
            borderRadius: "20px",
            padding: "40px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#b45309", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
            AI Coach Insight
          </span>
          <span
            style={{
              color: "#fef3c7",
              fontSize: "30px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {insight.content}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
          <span style={{ color: "#57534e", fontSize: "18px" }}>aixpense.in</span>
          <span style={{ color: "#57534e", fontSize: "18px" }}>Track smarter. Spend better.</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    },
  );
}
