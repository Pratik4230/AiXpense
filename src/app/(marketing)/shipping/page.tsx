import type { Metadata } from "next";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalWebPageJsonLd } from "@/components/legal/LegalWebPageJsonLd";
import { PlayStoreTextLink } from "@/components/landing/PlayStoreTextLink";
import { SITE_URL, getSupportEmail } from "@/lib/site";

export const dynamic = "force-static";

const PAGE_PATH = "/shipping" as const;
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "AiXpense digital delivery: instant access on web and Android after signup or payment; no physical shipping; support if Premium activation is delayed.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Shipping & Delivery | AiXpense",
    description:
      "AiXpense is a digital SaaS product—no parcels. Service access is immediate after registration or successful payment.",
  },
  twitter: {
    card: "summary",
    title: "AiXpense shipping & delivery",
    description:
      "How digital access to AiXpense is delivered on web and Android with no physical shipping.",
  },
};

export default function ShippingPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      lastUpdated="May 12, 2026"
    >
      <LegalWebPageJsonLd
        name="Shipping & Delivery Policy"
        description="Digital delivery policy for AiXpense: instant access, no physical goods, and support contacts."
        path={PAGE_PATH}
      />
      <section>
        <h2 className="text-xl font-semibold mb-3">Digital Product</h2>
        <p>
          AiXpense is a fully digital, cloud-based Software-as-a-Service (SaaS)
          application. There are no physical products, goods, or shipments
          involved. The Service is available on the web at aixpense.in and as a
          mobile application on{" "}
          <PlayStoreTextLink>Google Play</PlayStoreTextLink>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Service Delivery</h2>
        <p>
          Upon successful registration or payment for a Premium subscription,
          access to the Service is granted <strong>instantly</strong>. There is
          no waiting period, shipping time, or delivery process.
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong>Free Tier (Web):</strong> Immediate access upon account
            creation. No payment required.
          </li>
          <li>
            <strong>Free Tier (Android App):</strong> Immediate access upon
            installing the app from{" "}
            <PlayStoreTextLink>Google Play</PlayStoreTextLink> and signing in.
          </li>
          <li>
            <strong>Premium Subscription:</strong> Immediate access to all
            Premium features upon successful payment confirmation from Razorpay
            or Google Play.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Access Methods</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Web:</strong> Access the Service through your browser at
            aixpense.in. No installation required. Works on any modern browser
            on desktop or mobile.
          </li>
          <li>
            <strong>Android App:</strong> Download AiXpense from{" "}
            <PlayStoreTextLink>Google Play</PlayStoreTextLink>. Install on any
            Android device running Android 8.0
            (Oreo) or later.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Delayed Access</h2>
        <p>
          In rare cases, there may be a brief delay (typically under 5 minutes)
          between payment confirmation and Premium feature activation due to
          payment processing. If your Premium access is not activated within 30
          minutes of payment, please contact us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary hover:underline"
          >
            {supportEmail}
          </a>{" "}
          with your transaction ID.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p>
          For any questions regarding service delivery, visit our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact Us
          </a>{" "}
          page or email us at{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary hover:underline"
          >
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
