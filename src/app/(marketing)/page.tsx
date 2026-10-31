import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing/LandingPageView";
import { CURRENCIES } from "@/constants/currency";
import { PLAY_STORE_URL } from "@/constants/play-store";
import { SITE_URL } from "@/lib/site";
import { getVerifiedUserCount } from "@/lib/publicStats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "AiXpense  -  AI expense tracker India | Android app, voice & bill scan",
  description: `Paid AI expense tracker for India on web and Google Play. Log "Zomato 450" in Hindi, Marathi, Hinglish & 22+ languages using voice, text, or receipt scan. Premium includes unlimited AI and budgets. Download Android: ${PLAY_STORE_URL.replace("https://", "")}. ${CURRENCIES.length}+ currencies.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AiXpense",
    title: "AiXpense  -  AI expense tracker for India | Web & Android",
    description: `Voice and text expense logging on web or Android (Google Play). Premium includes budgets, AI insights, receipt scanning, and ${CURRENCIES.length}+ currencies.`,
    images: [
      {
        url: "/og-image.png",
        width: 1905,
        height: 931,
        alt: "AiXpense  -  AI-powered expense tracker for web and Android",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Pratik4230",
    creator: "@Pratik4230",
    title: "AiXpense  -  AI expense tracker | Web & Google Play",
    description: `Track money in one line of chat - Hindi, Hinglish, ${CURRENCIES.length}+ currencies. Android app on Google Play. No spreadsheet.`,
    images: ["/og-image.png"],
  },
};

export default async function LandingPage() {
  const verifiedUserCount = await getVerifiedUserCount();

  return <LandingPageView verifiedUserCount={verifiedUserCount} />;
}
