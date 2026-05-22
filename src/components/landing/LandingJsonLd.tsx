import { CURRENCIES } from "@/constants/currency";
import { SITE_URL } from "@/lib/site";

import { LANDING_FAQS } from "./data";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pratik Jadhav",
  url: "https://www.linkedin.com/in/pratikjadhav1438/",
  sameAs: [
    "https://www.linkedin.com/in/pratikjadhav1438/",
    "https://x.com/Pratik4230",
    "https://twitter.com/Pratik4230",
  ],
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: "AiXpense",
    url: SITE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AiXpense",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  sameAs: [
    "https://www.linkedin.com/in/pratikjadhav1438/",
    "https://x.com/Pratik4230",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AiXpense",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "AiXpense",
    url: SITE_URL,
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AiXpense - AI Expense Tracker",
  alternateName: ["AiXpense", "AI Xpense", "AI Expense Tracker"],
  url: SITE_URL,
  description:
    "AiXpense: stop losing track of spending—log with plain lines like Zomato 450 or petrol 800 aaj in Hindi, Marathi, Hinglish, English & 22+ Indian languages. No forms or spreadsheets. Free tier with 7 AI messages/day; Premium adds unlimited AI, receipt scan, recurring rules, reports.",
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Expense Tracker",
  operatingSystem: "Web",
  inLanguage: ["en", "hi", "mr", "ta", "te", "bn", "gu", "kn", "ml", "pa"],
  featureList: [
    "Voice and text expense tracking in 22+ Indian languages",
    "Natural language and Hinglish input",
    `Multi-currency account support (${CURRENCIES.length}+ ISO currencies)`,
    "AI auto-categorization, tags, and search",
    "Bill and receipt scanning (Premium)",
    "Monthly budgets with alerts",
    "Spending analytics, charts, and shareable report cards (Premium)",
    "Recurring payment rules in the app (Premium)",
    "Unlimited AI conversations (Premium)",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      name: "Free Plan",
      description: "7 AI messages per day with full expense tracking",
    },
    {
      "@type": "Offer",
      price: "499",
      priceCurrency: "INR",
      name: "Premium Monthly",
      billingIncrement: "P1M",
    },
    {
      "@type": "Offer",
      price: "3999",
      priceCurrency: "INR",
      name: "Premium Yearly",
      billingIncrement: "P1Y",
    },
  ],
  author: {
    "@type": "Person",
    name: "Pratik Jadhav",
    url: "https://www.linkedin.com/in/pratikjadhav1438/",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const chunks = [
  softwareJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  personJsonLd,
  faqJsonLd,
];

export function LandingJsonLd() {
  return (
    <>
      {chunks.map((data) => (
        <script
          key={(data as { "@type": string })["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
