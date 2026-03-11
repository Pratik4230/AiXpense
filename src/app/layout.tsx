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
    default: "AiXpense - AI-Powered Expense Tracker",
    template: "%s | AiXpense",
  },
  description:
    "Track expenses by voice or text with AI. Say 'Lunch 250' in Hindi, Marathi, or English and AiXpense categorizes, tags, and logs it instantly. Free expense tracker for India.",
  keywords: [
    "AiXpense",
    "AI expense tracker",
    "AI xpense",
    "AI expenses",
    "expense AI",
    "expense tracker AI",
    "AI expense manager",
    "AI money tracker",
    "artificial intelligence expense tracker",
    "natural language expense tracker",
    "smart expense tracker",
    "expense tracking app",
    "personal finance app",
    "budget tracker app",
    "AI budget manager",
    "AI finance app",
    "money management app",
    "spending tracker",
    "income and expense tracker",
    "free expense tracker India",
    "expense tracker for India",
    "voice expense tracker",
    "speak to track expenses",
    "voice expense tracker India",
    "Hindi expense tracker",
    "track expenses by voice",
    "expense tracker Hindi Marathi",
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
    title: "AiXpense - AI-Powered Expense Tracker",
    description:
      "Stop filling out boring forms. Just type your expense in plain English and AiXpense handles categorization, tagging, and analytics automatically.",
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
    title: "AiXpense - AI-Powered Expense Tracker",
    description:
      "Track expenses with natural language. Type 'Lunch 250' and AI handles the rest.",
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
