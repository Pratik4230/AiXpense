"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { LANDING_FAQS } from "./data";

export function LandingFaq() {
  return (
    <Accordion
      type="single"
      collapsible
      className="max-w-2xl mx-auto divide-y divide-border/50"
    >
      {LANDING_FAQS.map(({ q, a }, i) => (
        <AccordionItem key={q} value={`faq-${i}`} className="border-0 py-1">
          <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-4">
            {q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
            {a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
