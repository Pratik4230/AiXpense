import type { Metadata } from "next";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalWebPageJsonLd } from "@/components/legal/LegalWebPageJsonLd";
import { SITE_URL, getSupportEmail } from "@/lib/site";

export const dynamic = "force-static";

const PAGE_PATH = "/refund" as const;
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Billing, payments & cancellation (no refunds)",
  description:
    "How AiXpense Premium billing works on web and Android: completed subscription payments are not refunded, how to cancel, auto-renewal, Play Store purchases, and free tier.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "article",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Billing, payments & cancellation | AiXpense",
    description:
      "No refunds on completed Premium payments; cancel anytime; auto-renewal rules; Play Store vs web billing.",
  },
  twitter: {
    card: "summary",
    title: "AiXpense billing & cancellation",
    description:
      "Subscription terms: no refunds on completed payments; cancel before renewal; free tier available.",
  },
};

export default function BillingAndCancellationPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageLayout
      title="Billing, payments & cancellation"
      lastUpdated="May 12, 2026"
    >
      <LegalWebPageJsonLd
        name="Billing, payments & cancellation"
        description="AiXpense subscription billing, cancellation, auto-renewal, and no-refund policy for web and Android."
        path={PAGE_PATH}
      />

      <section>
        <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
        <p>
          This page explains how payments, renewals, and cancellations work for
          AiXpense. AiXpense does not offer refunds on subscription fees once a
          payment has completed—please read this carefully before subscribing.
          It applies to Premium purchases on the web at aixpense.in and to
          subscriptions purchased through the Google Play Store where noted
          below.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. No refunds on completed payments</h2>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="font-medium text-foreground">
            All payments made towards AiXpense Premium subscriptions are
            non-refundable. Once a payment is processed, no refunds will be
            issued under any circumstances.
          </p>
        </div>
        <p className="mt-3">By subscribing to Premium, you acknowledge that:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>All sales are final</li>
          <li>No full or partial refunds will be provided</li>
          <li>
            No credits or adjustments will be issued for unused portions of a
            subscription period
          </li>
          <li>
            No refunds will be given for failure to cancel before auto-renewal
          </li>
        </ul>
        <p className="mt-3">
          We encourage you to use the free tier first—including voice input,
          basic tracking, and (where available) trial limits—to confirm the
          Service fits you before paying.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">3. Free tier</h2>
        <p>
          AiXpense offers a free tier with limited AI interactions per day. The
          free tier is available on web and the Android app, does not require
          payment, and can be used without a time limit. Use it to evaluate voice,
          chat, and core tracking before upgrading.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          4. Premium subscription plans (web, INR)
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Monthly plan:</strong> ₹499/month, billed monthly
          </li>
          <li>
            <strong>Yearly plan:</strong> ₹3,999/year, billed annually
          </li>
        </ul>
        <p className="mt-2">
          After successful payment you get immediate access to Premium features,
          including unlimited AI messages (subject to fair use in the product),
          AI spending coach style insights, receipt scanning where enabled,
          recurring payment rules in the app, and shareable report cards, as
          described in the app and Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">5. Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            You may cancel Premium at any time from your account settings on
            web or in the mobile app.
          </li>
          <li>
            After cancellation, Premium access continues until the end of the
            current billing period. You will not be charged again for that plan
            unless you resubscribe.
          </li>
          <li>
            When the paid period ends, your account returns to the free tier.
            Your data (expenses, budgets, recurring rules, conversations, etc.)
            remains available subject to the Terms and Privacy Policy.
          </li>
          <li>
            No refunds or credits are issued for any unused time left in the
            billing period when you cancel.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Auto-renewal</h2>
        <p>
          Subscriptions renew automatically at the end of each billing cycle
          unless you cancel before the renewal date. You are responsible for
          cancelling in time if you do not want to continue. Charges caused by
          not cancelling in time are not refunded.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. Google Play purchases</h2>
        <p>
          If you buy Premium through the Google Play Store, Google&apos;s terms
          and refund windows apply in addition to this policy. Refund requests
          for Play-billed subscriptions must go through the Play Store where
          eligible. AiXpense&apos;s no-refund rule applies to direct web
          purchases on aixpense.in as described above.
        </p>
        <p className="mt-2">
          <a
            href="https://play.google.com/about/play-terms/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Play Terms of Service
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
        <p>
          Questions about billing or this policy: email{" "}
          <a
            href={`mailto:${supportEmail}`}
            className="text-primary hover:underline"
          >
            {supportEmail}
          </a>{" "}
          or use the{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact
          </a>{" "}
          page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
