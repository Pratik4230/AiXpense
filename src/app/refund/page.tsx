import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Refund and cancellation policy for AiXpense premium subscriptions on web and Android mobile app.",
  alternates: { canonical: "https://aixpense.in/refund" },
};

export default function RefundPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      lastUpdated="April 21, 2026"
    >
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
        <p>
          This Refund &amp; Cancellation Policy applies to all Premium
          subscription purchases made on AiXpense, whether through the web
          application at aixpense.in or the Android mobile application on the
          Google Play Store. Please read this policy carefully before
          subscribing.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. No Refund Policy</h2>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="font-medium text-foreground">
            All payments made towards AiXpense Premium subscriptions are
            non-refundable. Once a payment is processed, no refunds will be
            issued under any circumstances.
          </p>
        </div>
        <p className="mt-3">
          By subscribing to a Premium plan, you acknowledge and agree that:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>All sales are final</li>
          <li>No full or partial refunds will be provided</li>
          <li>
            No credits or adjustments will be issued for unused portions of a
            subscription
          </li>
          <li>
            No refunds will be given for failure to cancel before auto-renewal
          </li>
        </ul>
        <p className="mt-3">
          We encourage you to use the free tier to evaluate the Service before
          making any purchase.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">3. Free Tier</h2>
        <p>
          AiXpense offers a free tier with limited AI interactions per day. The
          free tier is available on both web and the Android mobile app, does
          not require any payment, and can be used indefinitely. We recommend
          trying the free tier first — including voice input, bill scanning, and
          basic expense tracking — to ensure the Service meets your needs before
          upgrading.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          4. Premium Subscription Plans
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Monthly Plan:</strong> ₹499/month, billed monthly
          </li>
          <li>
            <strong>Yearly Plan:</strong> ₹4,000/year, billed annually
          </li>
        </ul>
        <p className="mt-2">
          All subscriptions provide immediate access to Premium features upon
          successful payment, including unlimited AI messages, AI spending coach
          reports, receipt scanning, recurring payment management, and shareable
          report cards.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">5. Cancellation Policy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            You may cancel your Premium subscription at any time from your
            account settings on web or the mobile app.
          </li>
          <li>
            Upon cancellation, your Premium access continues until the end of
            the current billing period. No further charges will be made.
          </li>
          <li>
            After the billing period ends, your account will revert to the free
            tier. Your data — including expenses, budgets, recurring rules, and
            AI conversations — will be fully retained.
          </li>
          <li>
            No refunds or credits are issued for the remaining unused period
            upon cancellation.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Auto-Renewal</h2>
        <p>
          Subscriptions automatically renew at the end of each billing cycle
          unless cancelled before the renewal date. It is your responsibility to
          cancel before the renewal date if you do not wish to continue. No
          refunds will be provided for charges resulting from failure to cancel.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. Play Store Purchases</h2>
        <p>
          If you purchase a Premium subscription through the Google Play Store,
          your purchase is also subject to the{" "}
          <a
            href="https://play.google.com/about/play-terms/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Play Terms of Service
          </a>
          . Refund requests for Play Store purchases must be submitted through
          the Google Play Store within the eligible window as defined by Google.
          AiXpense&apos;s no-refund policy applies to direct purchases made on
          aixpense.in.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
        <p>
          For any questions regarding this policy, reach out to us at{" "}
          <a
            href={`mailto:${process.env.ADMIN_EMAIL}`}
            className="text-primary hover:underline"
          >
            {process.env.ADMIN_EMAIL}
          </a>{" "}
          or visit our{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact Us
          </a>{" "}
          page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
