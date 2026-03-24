import { MetadataRoute } from "next";

const BASE_URL = "https://aixpense.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/login",
          "/signup",
          "/contact",
          "/privacy",
          "/terms",
          "/refund",
          "/shipping",
        ],
        disallow: [
          "/api/",
          "/aixpense/",
          "/budgets/",
          "/reports/",
          "/transactions/",
          "/profile/",
          "/premium/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
