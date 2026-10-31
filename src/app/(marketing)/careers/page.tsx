import type { Metadata } from "next";

import { CareersPageView } from "@/components/careers/CareersPageView";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const CANONICAL = `${SITE_URL}/careers`;

export const metadata: Metadata = {
  title: "Careers at AiXpense | Build the future of money clarity",
  description:
    "Join AiXpense as a fresher or early-career engineer. Explore full-stack web, agentic AI and React Native developer roles.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Careers at AiXpense",
    description:
      "Build real web, AI and mobile product experiences at AiXpense. Developers with 0 to 2 years of experience are welcome.",
  },
};

export default function CareersPage() {
  return <CareersPageView />;
}
