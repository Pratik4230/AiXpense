import type { Metadata } from "next";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalWebPageJsonLd } from "@/components/legal/LegalWebPageJsonLd";
import { PlayStoreTextLink } from "@/components/landing/PlayStoreTextLink";
import { SITE_URL, getSupportEmail } from "@/lib/site";

export const dynamic = "force-static";

const PAGE_PATH = "/terms" as const;
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using AiXpense AI-powered expense tracking on web and Android: accounts, Premium billing, voice and camera features, acceptable use, and liability.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Terms & Conditions | AiXpense",
    description:
      "Legal terms for AiXpense: service description, subscriptions, payments, voice and image processing, and user responsibilities.",
  },
  twitter: {
    card: "summary",
    title: "AiXpense Terms & Conditions",
    description:
      "Read the terms for using AiXpense on web and Android, including Premium and data processing.",
  },
};

export default function TermsPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="May 12, 2026">
      <LegalWebPageJsonLd
        name="Terms & Conditions"
        description="Terms of use for the AiXpense AI expense tracking service on web and Android."
        path={PAGE_PATH}
      />
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to AiXpense. These Terms &amp; Conditions (&quot;Terms&quot;)
          govern your use of the AiXpense web application, website at
          aixpense.in, and mobile application on{" "}
          <PlayStoreTextLink>Google Play</PlayStoreTextLink> (collectively, the
          &quot;Service&quot;) operated by Pratik Jadhav
          (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing or
          using the Service, you agree to be bound by these Terms. If you do not
          agree, you must not use the Service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          2. Description of Service
        </h2>
        <p>
          AiXpense is an AI-powered expense and income tracking application that
          allows users to record financial transactions through multiple input
          methods including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            <strong>Natural language text</strong>: type in plain English,
            Hindi, or 22+ Indian languages
          </li>
          <li>
            <strong>Voice input</strong>: speak in English, Hindi, Marathi, Hinglish,
            and 22+ Indian languages via Sarvam AI&apos;s speech recognition
          </li>
          <li>
            <strong>Camera / bill scanning</strong>: photograph receipts and
            bills; our AI extracts amounts and merchant details automatically
          </li>
          <li>
            <strong>Image upload</strong>: upload existing photos of bills from
            your device gallery
          </li>
        </ul>
        <p className="mt-2">
          The Service uses artificial intelligence (powered by OpenAI) to parse,
          categorize, and organize your financial data, and provides features
          including budget management, spending analytics, recurring payment
          scheduling, and an AI spending coach.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">3. Eligibility</h2>
        <p>
          You must be at least 18 years of age to use this Service. By using the
          Service, you represent and warrant that you meet this requirement and
          have the legal capacity to enter into these Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">4. Account Registration</h2>
        <p>
          To use the Service, you must create an account using your email
          address, or via Google or GitHub authentication. You are responsible
          for maintaining the confidentiality of your account credentials and
          for all activities under your account. You agree to provide accurate
          and complete information and to notify us immediately of any
          unauthorized use.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          5. Device Permissions &amp; Feature Usage
        </h2>
        <p>
          Certain features of the Service require device permissions. By using
          these features you agree to the following:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Microphone:</strong> Voice input requires microphone access.
            Audio is processed by Sarvam AI for transcription. You may revoke
            this permission at any time. Audio is not stored on our servers.
          </li>
          <li>
            <strong>Camera &amp; Photo Library:</strong> Bill scanning requires
            camera or gallery access. Images are sent to our AI service for
            data extraction and are not stored permanently.
          </li>
          <li>
            You grant us and our third-party AI providers a limited,
            non-exclusive, transient license to process voice and image data
            solely for the purpose of delivering the requested feature.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Free &amp; Premium Plans</h2>
        <p>
          AiXpense offers a free tier with limited AI interactions and a Premium
          subscription with unlimited access. Expense and budget amounts in the
          app use the currency you choose in account settings. Premium
          subscription pricing for India (Razorpay checkout) is:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Monthly: ₹499/month</li>
          <li>Yearly: ₹3,999/year</li>
        </ul>
        <p className="mt-2">
          Prices are inclusive of applicable taxes unless stated otherwise. We
          reserve the right to modify pricing with prior notice to existing
          subscribers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. Payment Terms</h2>
        <p>
          Payments are processed securely via Razorpay. By purchasing a Premium
          subscription, you authorize us to charge the applicable fee to your
          chosen payment method. Subscriptions auto-renew at the end of each
          billing cycle unless cancelled before the renewal date. All payments
          are non-refundable. Refer to our{" "}
          <a href="/refund" className="text-primary hover:underline">
            Billing, payments &amp; cancellation
          </a>{" "}
          for full details.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          8. Recurring Payments Feature
        </h2>
        <p>
          AiXpense allows you to configure recurring payment rules (e.g., monthly
          subscriptions, EMIs) that automatically log transactions on a scheduled
          basis. By setting up a recurring rule you acknowledge that:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            AiXpense&apos;s recurring feature logs entries in the app; it does
            not initiate actual bank debits on your behalf
          </li>
          <li>You are responsible for verifying the accuracy of recurring entries</li>
          <li>
            You can modify or delete recurring rules at any time from your
            account settings
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">9. User Obligations</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the Service only for lawful purposes</li>
          <li>Not attempt to reverse-engineer, hack, or exploit the Service</li>
          <li>
            Not use the Service to store or transmit illegal or harmful content
          </li>
          <li>Not impersonate another person or entity</li>
          <li>
            Not use automated tools to access the Service without permission
          </li>
          <li>
            Not misuse voice or camera features to capture third-party private
            information without consent
          </li>
        </ul>
        <p className="mt-2">
          Violation of these obligations may result in immediate account
          termination without refund.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">10. Intellectual Property</h2>
        <p>
          All rights, title, and interest in the Service, including its source
          code, design, logos, and content, are owned by us. You retain
          ownership of the financial data you input into the Service. You grant
          us a limited, non-exclusive license to process your data, including
          voice transcripts and extracted bill data, solely for the purpose of
          providing the Service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">11. AI Disclaimer</h2>
        <p>
          The AI-powered features of AiXpense, including natural language
          parsing, voice transcription, bill scanning, and AI spending coach
          insights, are provided for convenience and may not always be 100%
          accurate. AI-generated categorizations, insights, and suggestions
          should not be considered financial advice. You are responsible for
          verifying the accuracy of your financial records. We are not liable
          for any decisions made based on AI-generated outputs.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">12. Data &amp; Privacy</h2>
        <p>
          Your use of the Service is also governed by our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your personal data
          including voice, camera, and mobile device data.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">13. Service Availability</h2>
        <p>
          We strive to maintain high availability but do not guarantee
          uninterrupted access. The Service may be temporarily unavailable due
          to maintenance, updates, or circumstances beyond our control. We are
          not liable for any loss arising from service downtime.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          14. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, AiXpense and its owner shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of the Service. Our total
          liability shall not exceed the amount you paid to us in the 12 months
          preceding the claim.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">15. Termination</h2>
        <p>
          We may suspend or terminate your account at any time for violation of
          these Terms. You may delete your account at any time from your account
          settings. Upon deletion, your access ceases immediately and all your
          personal data, including expenses, budgets, AI conversations,
          recurring rules, and subscription records, is permanently and
          irreversibly deleted. This action cannot be undone.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">16. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. Material
          changes will be communicated via email or in-app notification.
          Continued use of the Service after changes constitutes acceptance of
          the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          17. Governing Law &amp; Dispute Resolution
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of India. Any disputes arising from these Terms shall be subject
          to the exclusive jurisdiction of the courts in Karad, Maharashtra,
          India. Before initiating legal proceedings, both parties agree to
          attempt resolution through good-faith negotiation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">18. Contact</h2>
        <p>
          For questions regarding these Terms, contact us at:{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary hover:underline"
          >
            {supportEmail}
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
