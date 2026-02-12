import { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | AiXpense",
  description:
    "Privacy policy for AiXpense - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="February 12, 2026">
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p>
          This Privacy Policy explains how AiXpense, operated by Pratik Jadhav
          (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), collects, uses,
          stores, and protects your personal data when you use our AI-powered
          expense tracking application. This policy complies with the
          Information Technology Act, 2000, the IT (Reasonable Security
          Practices and Procedures and Sensitive Personal Data or Information)
          Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP
          Act).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
        <p>We collect the following categories of data:</p>
        <h3 className="text-lg font-medium mt-4 mb-2">
          2.1 Account Information
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Full name</li>
          <li>Email address</li>
          <li>Profile picture (if provided via Google/GitHub login)</li>
          <li>Authentication provider details (Google, GitHub)</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">
          2.2 Financial Data (User-Provided)
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Expense and income descriptions and amounts</li>
          <li>Categories and tags assigned to transactions</li>
          <li>Budget configurations</li>
          <li>Chat conversations with the AI assistant</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">
          2.3 Technical Data (Automatically Collected)
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Usage patterns and session data</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">2.4 Payment Data</h3>
        <p>
          We do not directly store your credit/debit card numbers or UPI
          details. All payment processing is handled by Razorpay, our
          third-party payment processor. We only store transaction references,
          plan details, and subscription status.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          3. Purpose of Data Collection
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide and maintain the expense tracking Service</li>
          <li>
            To process your natural language inputs through AI for
            categorization
          </li>
          <li>To generate financial insights and analytics</li>
          <li>To process payments and manage subscriptions</li>
          <li>To send transactional emails (password resets, receipts)</li>
          <li>To improve the Service and fix issues</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          4. Third-Party Data Sharing
        </h2>
        <p>
          We share your data with the following third-party service providers,
          strictly for the purpose of delivering the Service:
        </p>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium">OpenAI</p>
            <p className="text-sm mt-1">
              Your chat messages and transaction descriptions are sent to
              OpenAI&apos;s API for AI-powered parsing and categorization.
              OpenAI processes this data per their data usage policies. We do
              not send your email, name, or payment details to OpenAI.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium">Razorpay</p>
            <p className="text-sm mt-1">
              Payment processing is handled by Razorpay. Your name, email, and
              payment details are shared with Razorpay for transaction
              processing. Razorpay is PCI-DSS compliant and regulated by the
              RBI.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-4">
            <p className="font-medium">Resend</p>
            <p className="text-sm mt-1">
              Your email address is shared with Resend for sending transactional
              emails such as password reset links and payment receipts.
            </p>
          </div>
        </div>
        <p className="mt-3">
          We do not sell, rent, or trade your personal data to any third party
          for marketing or advertising purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          5. Data Storage & Security
        </h2>
        <p>
          Your data is stored in encrypted MongoDB databases hosted on secure
          cloud infrastructure. We implement industry-standard security measures
          including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Encrypted data transmission (HTTPS/TLS)</li>
          <li>Hashed passwords (never stored in plaintext)</li>
          <li>Secure authentication tokens</li>
          <li>Regular security reviews</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active. If
          you delete your account, we will delete your personal data within 90
          days, except where retention is required by law or for legitimate
          business purposes (e.g., fraud prevention, legal claims). Anonymized
          and aggregated data may be retained indefinitely for analytics.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          7. Your Rights (Under DPDP Act, 2023)
        </h2>
        <p>As a data principal, you have the right to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            <strong>Access</strong> - Request a summary of your personal data
            and processing activities
          </li>
          <li>
            <strong>Correction</strong> - Request correction of inaccurate or
            incomplete data
          </li>
          <li>
            <strong>Erasure</strong> - Request deletion of your personal data
            (subject to legal retention requirements)
          </li>
          <li>
            <strong>Withdraw Consent</strong> - Withdraw your consent for data
            processing at any time (this may affect Service availability)
          </li>
          <li>
            <strong>Grievance Redressal</strong> - File a complaint with our
            Grievance Officer
          </li>
          <li>
            <strong>Nominate</strong> - Nominate another individual to exercise
            your rights in case of death or incapacity
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Cookies & Tracking</h2>
        <p>
          We use essential cookies for authentication and session management. We
          do not use third-party tracking cookies or advertising trackers. No
          data is shared with ad networks.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">9. Children&apos;s Data</h2>
        <p>
          AiXpense is not intended for individuals under 18 years of age. We do
          not knowingly collect personal data from children. If you believe a
          child has provided us with personal data, please contact us and we
          will promptly delete it.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          10. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via email or in-app notification at least 7 days
          before they take effect. Continued use of the Service after changes
          constitutes acceptance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">11. Grievance Officer</h2>
        <p>
          In accordance with the IT Act, 2000 and DPDP Act, 2023, the details of
          the Grievance Officer are:
        </p>
        <div className="mt-3 rounded-lg border border-border/50 p-4 space-y-1">
          <p>
            <strong>Name:</strong> Pratik Jadhav
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:pratikjadhav1438@gmail.com"
              className="text-primary hover:underline"
            >
              pratikjadhav1438@gmail.com
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Grievances will be acknowledged within 48 hours and resolved within
            30 days of receipt.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
