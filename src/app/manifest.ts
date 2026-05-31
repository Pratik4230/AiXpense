import type { MetadataRoute } from "next";

import { PLAY_STORE_PACKAGE, PLAY_STORE_URL } from "@/constants/play-store";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AiXpense - AI Expense Tracker",
    short_name: "AiXpense",
    description:
      "Track expenses by voice, text, or bill scan in Hindi, Marathi & 22+ Indian languages. Web app with Android app on Google Play.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#f97316",
    orientation: "portrait",
    related_applications: [
      {
        platform: "play",
        url: PLAY_STORE_URL,
        id: PLAY_STORE_PACKAGE,
      },
    ],
    prefer_related_applications: true,
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
