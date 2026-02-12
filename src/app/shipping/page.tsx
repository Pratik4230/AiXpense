import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | AiXpense",
  description: "Shipping and delivery policy for AiXpense digital services.",
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      title="Shipping & Delivery Policy"
      lastUpdated="February 12, 2026"
    >
      <section>
        <h2 className="text-xl font-semibold mb-3">Digital Product</h2>
        <p>
          AiXpense is a fully digital, cloud-based Software-as-a-Service (SaaS)
          application. There are no physical products, goods, or shipments
          involved.
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
            <strong>Free Tier:</strong> Immediate access upon account creation.
            No payment required.
          </li>
          <li>
            <strong>Premium Subscription:</strong> Immediate access to all
            Premium features upon successful payment confirmation from Razorpay.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Access Method</h2>
        <p>
          The Service is accessed entirely through your web browser at our
          website. No software download or installation is required. You can
          access AiXpense from any device with a modern web browser and an
          internet connection.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Delayed Access</h2>
        <p>
          In rare cases, there may be a brief delay (typically under 5 minutes)
          between payment confirmation and Premium feature activation due to
          payment processing. If your Premium access is not activated within 30
          minutes of payment, please contact us at{" "}
          <a
            href="mailto:pratikjadhav1438@gmail.com"
            className="text-primary hover:underline"
          >
            pratikjadhav1438@gmail.com
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
            href="mailto:pratikjadhav1438@gmail.com"
            className="text-primary hover:underline"
          >
            pratikjadhav1438@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
