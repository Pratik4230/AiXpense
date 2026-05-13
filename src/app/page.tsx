import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing/LandingPageView";
import { CURRENCIES } from "@/constants/currency";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "AiXpense — AI expense tracker India | Voice, text & bill scan",
  description: `Stop losing track of where your money went: log with lines like "Zomato 450" in Hindi, Marathi, Hinglish & 22+ languages—no forms. Free: 7 AI chats/day. Premium: unlimited AI, receipt scan, recurring rules. ${CURRENCIES.length}+ currencies. Android beta streak: 3 months Premium once.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AiXpense",
    title: "AiXpense — AI expense tracker for India",
    description: `Plain-language expense logging—voice & text, budgets, ${CURRENCIES.length}+ currencies. Free tier + Premium. Android streak reward.`,
    images: [
      {
        url: "/og-image.png",
        width: 1905,
        height: 931,
        alt: "AiXpense — AI-powered expense tracker",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Pratik4230",
    creator: "@Pratik4230",
    title: "AiXpense — AI expense tracker | Voice & text",
    description: `Track money in one line of chat—Hindi, Hinglish, ${CURRENCIES.length}+ currencies. No spreadsheet. Premium scan & insights.`,
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  return <LandingPageView />;
}
