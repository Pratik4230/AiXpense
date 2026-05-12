import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing/LandingPageView";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "AiXpense — AI expense tracker India | Voice, text & bill scan",
  description:
    "Track expenses in seconds with AiXpense: voice in Hindi, Marathi & 22+ languages, natural-language text, budgets, and AI categorization. Free tier with 7 AI messages/day; Premium adds unlimited AI, receipt scan, recurring rules & report cards.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AiXpense",
    title: "AiXpense — AI expense tracker for India",
    description:
      "Log spending by voice, text, or receipt scan. Built for Indian languages, budgets, and fast search. Start free, upgrade to Premium when you need unlimited AI.",
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
    description:
      "Free AI expense tracker for India: voice, Hinglish, bill scan on Premium, budgets & insights. Try it in your browser.",
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  return <LandingPageView />;
}
