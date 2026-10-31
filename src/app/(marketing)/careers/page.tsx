import type { Metadata } from "next";

import { CareersPageView } from "@/components/careers/CareersPageView";
import { careerRoles } from "@/components/careers/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const CANONICAL = `${SITE_URL}/careers`;

export const metadata: Metadata = {
  title: "Careers at AiXpense | Build the future of money clarity",
  description:
    "Join AiXpense as a fresher or early-career engineer. Explore full-stack web, agentic AI and React Native developer roles.",
  keywords: ["developer jobs India", "software engineer jobs for freshers", "full stack developer jobs", "React developer jobs", "Node.js developer jobs", "AI developer jobs", "React Native developer jobs", "early career engineering jobs"],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Careers at AiXpense",
    description:
      "Build real web, AI and mobile product experiences at AiXpense. Developers with 0 to 2 years of experience are welcome.",
    images: [{ url: "/og-image.png", width: 1905, height: 931, alt: "Careers at AiXpense" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at AiXpense",
    description:
      "Build real web, AI and mobile product experiences at AiXpense.",
    images: ["/og-image.png"],
  },
};

export default function CareersPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "AiXpense",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        sameAs: [
          "https://www.linkedin.com/in/pratikjadhav1438/",
          "https://x.com/Pratik4230",
        ],
      },
      {
        "@type": "WebPage",
        name: "Careers at AiXpense",
        url: CANONICAL,
        description: "Open early-career engineering roles at AiXpense.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        name: "Open roles at AiXpense",
        itemListElement: careerRoles.map((role, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${CANONICAL}/${role.id}`,
          name: role.title,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CareersPageView />
    </>
  );
}
