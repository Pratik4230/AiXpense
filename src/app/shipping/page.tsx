import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "AiXpense is a digital SaaS product available on web and Android. Access is granted instantly upon signup or payment - no physical shipping involved.",
  alternates: { canonical: "https://aixpense.in/shipping" },
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      lastUpdated="April 21, 2026"
    >
      <section>
        <h2 className="text-xl font-semibold mb-3">Digital Product</h2>
        <p>
          AiXpense is a fully digital, cloud-based Software-as-a-Service (SaaS)
          application. There are no physical products, goods, or shipments
          involved. The Service is available on the web at aixpense.in and as a
          mobile application on the Google Play Store.
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
            installing the app from the Google Play Store and signing in.
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
            <strong>Android App:</strong> Download the AiXpense app from the
            Google Play Store. Install on any Android device running Android 8.0
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
            href={`mailto:${process.env.ADMIN_EMAIL}`}
            className="text-primary hover:underline"
          >
            {process.env.ADMIN_EMAIL}
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
            href={`mailto:${process.env.ADMIN_EMAIL}`}
            className="text-primary hover:underline"
          >
            {process.env.ADMIN_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
