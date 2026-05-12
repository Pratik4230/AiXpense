import { SITE_URL } from "@/lib/site";

type LegalWebPageJsonLdProps = {
  name: string;
  description: string;
  path: `/${string}`;
};

export function LegalWebPageJsonLd({
  name,
  description,
  path,
}: LegalWebPageJsonLdProps) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "AiXpense",
      url: SITE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
