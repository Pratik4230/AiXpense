import { NextRequest, NextResponse } from "next/server";

import { getCareerApplicationFee } from "@/lib/careers/applicationFee";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const fee = await getCareerApplicationFee(request.headers);
    return NextResponse.json(fee, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[job-application-fee]", error);
    return NextResponse.json({ error: "Unable to load the application fee" }, { status: 500, headers: { "Cache-Control": "private, no-store" } });
  }
}
