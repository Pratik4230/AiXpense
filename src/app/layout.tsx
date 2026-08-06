import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getConfiguredPublicAppUrl } from "@/lib/publicAppUrl";
import { SITE_URL } from "@/lib/site";
import {
  PLAY_STORE_PACKAGE,
  PLAY_STORE_URL,
} from "@/constants/play-store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});



const metadataBaseUrl = getConfiguredPublicAppUrl() ?? SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "AiXpense - AI Expense Tracker | Track Expenses by Voice & Text",
    template: "%s | AiXpense - AI Expense Tracker",
  },
  description:
    "Best AI expense tracker for India — web app and Android app on Google Play. Track daily expenses by voice, text, or bill scan in Hindi, Marathi, English & 22+ Indian languages. Free expense manager with budgets, AI categorization & spending analytics.",
  keywords: [
    "expense tracker",
    "AI expense tracker",
    "expense manager",
    "expense manager app",
    "daily expense tracker",
    "expense tracker app",
    "best expense tracker",
    "free expense tracker",
    "expense tracker India",
    "expense tracker app India",
    "android expense tracker",
    "expense tracker Android app",
    "Google Play expense tracker",
    "money tracker",
    "money manager",
    "spending tracker",
    "budget tracker",
    "income expense tracker",
    "personal finance app",
    "voice expense tracker",
    "AI money manager",
    "smart expense tracker",
    "expense tracker Hindi",
    "expense tracker Marathi",
    "kharcha tracker",
    "kharch tracker app",
    "receipt scanner app",
    "bill scanner expense",
    "track expenses online",
    "monthly expense tracker",
    "expense tracker with budget",
    "AiXpense",
    "AI xpense",
    "natural language expense tracker",
    "chatbot expense tracker",
  ],
  authors: [
    {
      name: "Pratik Jadhav",
      url: "https://www.linkedin.com/in/pratikjadhav1438/",
    },
  ],
  creator: "Pratik Jadhav",
  applicationName: "AiXpense",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: metadataBaseUrl,
  },
  appLinks: {
    android: {
      package: PLAY_STORE_PACKAGE,
      url: PLAY_STORE_URL,
      app_name: "AiXpense",
    },
    web: {
      url: metadataBaseUrl,
      should_fallback: true,
    },
  },
  other: {
    "google-play-app": `app-id=${PLAY_STORE_PACKAGE}`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: metadataBaseUrl,
    siteName: "AiXpense",
    title: "AiXpense - Best AI Expense Tracker App | Web & Android",
    description:
      "Track daily expenses by voice or text on web or Android. Say 'Lunch 250' in Hindi, Marathi or English. Download free on Google Play. AI auto-categorizes, tags & logs expenses instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1905,
        height: 931,
        alt: "AiXpense - AI-Powered Expense Tracker",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Pratik4230",
    creator: "@Pratik4230",
    title: "AiXpense - Best AI Expense Tracker App | Web & Google Play",
    description:
      "Free AI expense tracker for India. Web app + Android on Google Play. Voice in Hindi, Marathi & 22+ languages. Auto-categorization, budget alerts & spending analytics.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="antialiased h-full">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          {process.env.NODE_ENV === "production" ? (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          ) : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
