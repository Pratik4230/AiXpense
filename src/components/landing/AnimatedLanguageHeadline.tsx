"use client";

import { useEffect, useState } from "react";

const LANGUAGE_HEADLINES = [
  "Make sense of your money.", // English
  "पैसों का हिसाब, अब आसान।", // Hindi
  "पैशांचा हिशोब, आता सोपा.", // Marathi
  "உங்கள் பணக் கணக்கு", // Tamil
  "ನಿಮ್ಮ ಹಣಕಾಸು, ನಿಮ್ಮ ಕೈಯಲ್ಲಿ.", // Kannada
  "మీ ఖర్చులు, మీ నియంత్రణలో.", // Telugu
  "તમારા પૈસાનો હિસાબ, હવે સરળ.", // Gujarati
  "টাকার হিসাব, এবার সহজ।", // Bengali
] as const;

export function AnimatedLanguageHeadline() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % LANGUAGE_HEADLINES.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <h1
      aria-live="polite"
      aria-atomic="true"
      className="max-w-xl text-5xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]"
    >
      <span
        key={reducedMotion ? "static" : index}
        className={
          reducedMotion
            ? undefined
            : "animate-in fade-in slide-in-from-bottom-2 duration-500"
        }
      >
        {LANGUAGE_HEADLINES[index]}
      </span>
    </h1>
  );
}
