import type { Metadata } from "next";
import { Mail, Clock, MessageSquare, Smartphone } from "lucide-react";

import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { LegalWebPageJsonLd } from "@/components/legal/LegalWebPageJsonLd";
import { SITE_URL, getSupportEmail } from "@/lib/site";

export const dynamic = "force-static";

const PAGE_PATH = "/contact" as const;
const CANONICAL = `${SITE_URL}${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact AiXpense for billing, subscriptions, product support, or partnerships. Email the team; typical response within 48 business hours.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: CANONICAL,
    siteName: "AiXpense",
    title: "Contact AiXpense",
    description:
      "Reach AiXpense for help with your account, Premium billing, or general questions about the AI expense tracker.",
  },
  twitter: {
    card: "summary",
    title: "Contact AiXpense",
    description: "Billing, support, and general inquiries for AiXpense users.",
  },
};

export default function ContactPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageLayout title="Contact Us" lastUpdated="May 12, 2026">
      <LegalWebPageJsonLd
        name="Contact AiXpense"
        description="Contact information for AiXpense support, billing, and general inquiries."
        path={PAGE_PATH}
      />
      <section>
        <p>
          We are here to help. If you have questions, feedback, or need
          assistance with your AiXpense account on the web or the Android app,
          reach out through any of the channels below.
        </p>
      </section>

      <section>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="size-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Email Support</h3>
            <p className="text-sm text-muted-foreground">
              For general inquiries, account issues, billing and subscription questions, or voice and camera feature issues.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className="text-primary hover:underline text-sm font-medium inline-block"
            >
              {supportEmail}
            </a>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-3">
            <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="size-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Response Time</h3>
            <p className="text-sm text-muted-foreground">
              We aim to respond to all inquiries within 48 hours on business
              days (Monday to Friday, 10 AM - 7 PM IST).
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-3">
            <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Smartphone className="size-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Android App Support</h3>
            <p className="text-sm text-muted-foreground">
              For issues specific to the Android app (voice input, camera
              scanning, permissions, or Play Store billing), email us with your
              device model and Android version for faster resolution.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-3">
            <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold">Social Media</h3>
            <p className="text-sm text-muted-foreground">
              You can also reach out via social media for quick questions.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/in/pratikjadhav1438/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/Pratik4230"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm font-medium"
              >
                Twitter/X
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Business Details</h2>
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-2">
          <p>
            <strong>Operated by:</strong> Pratik Jadhav
          </p>
          <p>
            <strong>Location:</strong> Karad, Maharashtra, India
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-primary hover:underline"
            >
              {supportEmail}
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Grievance Officer</h2>
        <p>
          In compliance with the Information Technology Act, 2000, and the
          Digital Personal Data Protection Act, 2023, our Grievance Officer
          details are:
        </p>
        <div className="mt-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-2">
          <p>
            <strong>Name:</strong> Pratik Jadhav
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-primary hover:underline"
            >
              {supportEmail}
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
