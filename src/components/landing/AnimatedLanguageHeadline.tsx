"use client";

import { useEffect, useState } from "react";

const LANGUAGE_HEADLINES = [
  "Make sense of your money.", // English
  "पैसों का हिसाब, अब आसान।", // Hindi
  "खर्चाचा हिशोब, अगदी सोपा.", // Marathi
  "உங்கள் பணம், உங்கள் கட்டுப்பாட்டில்.", // Tamil
  "ನಿಮ್ಮ ಖರ್ಚು, ನಿಮ್ಮ ನಿಯಂತ್ರಣದಲ್ಲಿ.", // Kannada
  "మీ ఖర్చులు, మీ చేతుల్లో.", // Telugu
  "ખર્ચનો હિસાબ, હવે સરળ.", // Gujarati
  "খরচের হিসাব, এবার সহজ।", // Bengali
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
      className="grid w-full max-w-2xl grid-cols-1 items-start pb-3 text-4xl font-bold leading-[1.03] tracking-[-0.045em] min-h-32 sm:min-h-48 sm:text-6xl lg:min-h-44 lg:text-[4.6rem]"
    >
      {LANGUAGE_HEADLINES.map((headline) => (
        <span
          key={headline}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {headline}
        </span>
      ))}
      <span
        key={reducedMotion ? "static" : index}
        className={`col-start-1 row-start-1 ${
          reducedMotion
            ? ""
            : "animate-in fade-in slide-in-from-bottom-2 duration-500"
        }`}
      >
        {LANGUAGE_HEADLINES[index]}
      </span>
    </h1>
  );
}
