import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider, QueryProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://aixpense.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AiXpense - AI Expense Tracker | Track Expenses by Voice & Text",
    template: "%s | AiXpense - AI Expense Tracker",
  },
  description:
    "Best AI expense tracker for India. Track daily expenses by voice, text, or bill scan in Hindi, Marathi, English & 22+ Indian languages. Free expense manager app with budget tracking, spending analytics & AI categorization. Just say 'Lunch 250' and AiXpense logs it instantly.",
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
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "AiXpense",
    title: "AiXpense - Best AI Expense Tracker App | Free for India",
    description:
      "Track daily expenses by voice or text. Say 'Lunch 250' in Hindi, Marathi or English. AI auto-categorizes, tags & logs expenses instantly. Free expense manager with budget tracking & analytics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AiXpense - AI-Powered Expense Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Pratik4230",
    creator: "@Pratik4230",
    title: "AiXpense - Best AI Expense Tracker App | Voice & Text",
    description:
      "Free AI expense tracker for India. Track expenses by voice in Hindi, Marathi & 22+ languages. Auto-categorization, budget alerts & spending analytics.",
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
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
