import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing/LandingPageView";
import { CURRENCIES } from "@/constants/currency";
import { PLAY_STORE_URL } from "@/constants/play-store";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "AiXpense — AI expense tracker India | Android app, voice & bill scan",
  description: `AI expense tracker for India on web and Google Play. Log "Zomato 450" in Hindi, Marathi, Hinglish & 22+ languages—voice, text, or receipt scan. Free: 3 AI chats lifetime. Download Android: ${PLAY_STORE_URL.replace("https://", "")}. Premium: unlimited AI & budgets. ${CURRENCIES.length}+ currencies.`,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AiXpense",
    title: "AiXpense — AI expense tracker for India | Web & Android",
    description: `Voice & text expense logging on web or Android (Google Play). Budgets, ${CURRENCIES.length}+ currencies. Free tier + Premium.`,
    images: [
      {
        url: "/og-image.png",
        width: 1905,
        height: 931,
        alt: "AiXpense — AI-powered expense tracker for web and Android",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Pratik4230",
    creator: "@Pratik4230",
    title: "AiXpense — AI expense tracker | Web & Google Play",
    description: `Track money in one line of chat—Hindi, Hinglish, ${CURRENCIES.length}+ currencies. Android app on Google Play. No spreadsheet.`,
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  return <LandingPageView />;
}
