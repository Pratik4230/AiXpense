import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | AiXpense",
  description:
    "Terms and conditions for using AiXpense AI-powered expense tracking service.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="February 12, 2026">
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to AiXpense. These Terms & Conditions (&quot;Terms&quot;)
          govern your use of the AiXpense web application and services
          (collectively, the &quot;Service&quot;) operated by Pratik Jadhav
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
          allows users to record financial transactions through natural language
          input. The Service uses artificial intelligence (powered by OpenAI) to
          parse, categorize, and organize your financial data.
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
        <h2 className="text-xl font-semibold mb-3">5. Free & Premium Plans</h2>
        <p>
          AiXpense offers a free tier with limited AI interactions and a Premium
          subscription with unlimited access. Premium plans are available at:
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
        <h2 className="text-xl font-semibold mb-3">6. Payment Terms</h2>
        <p>
          Payments are processed securely via Razorpay. By purchasing a Premium
          subscription, you authorize us to charge the applicable fee to your
          chosen payment method. Subscriptions auto-renew at the end of each
          billing cycle unless cancelled before the renewal date. All payments
          are non-refundable. Refer to our{" "}
          <a href="/refund" className="text-primary hover:underline">
            Refund & Cancellation Policy
          </a>{" "}
          for full details.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. User Obligations</h2>
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
        </ul>
        <p className="mt-2">
          Violation of these obligations may result in immediate account
          termination without refund.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
        <p>
          All rights, title, and interest in the Service, including its source
          code, design, logos, and content, are owned by us. You retain
          ownership of the financial data you input into the Service. You grant
          us a limited, non-exclusive license to process your data solely for
          the purpose of providing the Service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">9. AI Disclaimer</h2>
        <p>
          The AI-powered features of AiXpense are provided for convenience and
          may not always be 100% accurate. AI-generated categorizations,
          insights, and suggestions should not be considered financial advice.
          You are responsible for verifying the accuracy of your financial
          records. We are not liable for any decisions made based on
          AI-generated outputs.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">10. Data & Privacy</h2>
        <p>
          Your use of the Service is also governed by our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , which describes how we collect, use, and protect your personal data.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">11. Service Availability</h2>
        <p>
          We strive to maintain high availability but do not guarantee
          uninterrupted access. The Service may be temporarily unavailable due
          to maintenance, updates, or circumstances beyond our control. We are
          not liable for any loss arising from service downtime.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          12. Limitation of Liability
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
        <h2 className="text-xl font-semibold mb-3">13. Termination</h2>
        <p>
          We may suspend or terminate your account at any time for violation of
          these Terms. You may delete your account at any time. Upon
          termination, your right to use the Service ceases immediately. We may
          retain your data as required by law or for legitimate business
          purposes as outlined in our Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">14. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time. Material
          changes will be communicated via email or in-app notification.
          Continued use of the Service after changes constitutes acceptance of
          the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          15. Governing Law & Dispute Resolution
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
        <h2 className="text-xl font-semibold mb-3">16. Contact</h2>
        <p>
          For questions regarding these Terms, contact us at:{" "}
          <a
            href="mailto:pratikjadhav1438@gmail.com"
            className="text-primary hover:underline"
          >
            pratikjadhav1438@gmail.com
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
