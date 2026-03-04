# AiXpense — SEO Reference

## Current State (Feb 2026)

### What's live

- Natural language expense & income tracking via AI chat
- Smart Analytics — category-wise charts, monthly trends
- Budget management with alerts
- Reports page
- Transactions history with filtering
- Premium subscription (₹499/mo, ₹3999/yr) via Razorpay
- Google + GitHub OAuth + email auth
- Admin panel (issues management)

### What's implemented (AI optimizations, not user-facing)

- textVerbosity, user identifier, safetyIdentifier
- maxToolCalls, gpt-5-nano specialist, truncation: auto
- store: false (no OpenAI data retention)
- promptCacheKey on specialist agent
- serviceTier: "flex" on specialist

---

## SEO Done (this session)

| File                             | What it does                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`             | Root metadata — title template, description, keywords, OG, Twitter, manifest                        |
| `src/app/sitemap.ts`             | Auto-generates `/sitemap.xml` with all public + blog URLs                                           |
| `src/app/robots.ts`              | Allows public pages, blocks all protected routes and API                                            |
| `src/app/opengraph-image.tsx`    | DELETED — replaced by static screenshot                                                             |
| `public/og-image.png`            | Real 1200×630 homepage screenshot — used as OG/Twitter image                                        |
| `public/site.webmanifest`        | PWA manifest for "Add to Home Screen" + browser branding                                            |
| `src/app/page.tsx`               | JSON-LD WebApplication schema + Person schema (founder) + "How it works" section + Blog footer link |
| `src/app/(auth)/login/page.tsx`  | `robots: noindex` + canonical                                                                       |
| `src/app/(auth)/signup/page.tsx` | `robots: noindex` + canonical                                                                       |
| `src/app/contact/page.tsx`       | Improved description + canonical                                                                    |
| `src/app/privacy/page.tsx`       | Improved description + canonical                                                                    |
| `src/app/terms/page.tsx`         | Title template + canonical                                                                          |
| `src/app/refund/page.tsx`        | Title template + canonical                                                                          |
| `src/app/shipping/page.tsx`      | Better description + canonical                                                                      |
| `src/lib/blog.ts`                | Reads MDX files from `src/content/blog/` automatically                                              |
| `src/app/blog/page.tsx`          | Blog listing at `/blog`                                                                             |
| `src/app/blog/[slug]/page.tsx`   | Individual posts with JSON-LD BlogPosting schema                                                    |

### Blog posts live

| File                                       | Target Keywords                                            |
| ------------------------------------------ | ---------------------------------------------------------- |
| `how-to-track-expenses-with-ai.mdx`        | "AI expense tracker", "track expenses with AI"             |
| `best-free-expense-tracker-india-2026.mdx` | "best expense tracker India", "free expense tracker India" |
| `how-to-budget-monthly-salary-india.mdx`   | "budget salary India", "50/30/20 rule India"               |

### Keywords targeted (root metadata)

AiXpense, AI expense tracker, AI xpense, AI expenses, expense AI,
expense tracker AI, AI expense manager, AI money tracker,
artificial intelligence expense tracker, natural language expense tracker,
smart expense tracker, expense tracking app, personal finance app,
budget tracker app, AI budget manager, AI finance app,
money management app, spending tracker, income and expense tracker,
free expense tracker India, expense tracker for India

---

## Rules for Future Updates

### Always update when

- Adding a new **public page** → add to `sitemap.ts` + add `metadata` export in `page.tsx`
- **Pricing changes** → update JSON-LD `offers` array in `src/app/page.tsx`
- **Homepage redesign** → retake screenshot → replace `public/og-image.png`
- **New feature launch** → update root `description` in `layout.tsx` + write a blog post

### Never needs updating

- Changes to protected pages (`/aixpense`, `/budgets`, `/reports`, `/transactions`, `/profile`, `/premium`, `/admin`)
- API routes (`/api/*`)
- Bug fixes, UI tweaks behind login
- Auth pages — already `noindex`

### To add a new blog post

1. Create `src/content/blog/your-post-slug.mdx`
2. Add frontmatter:

```
---
title: "Your Post Title"
description: "One sentence description for Google."
publishedAt: "2026-MM-DD"
readingTime: "X min read"
tags: ["Tag1", "Tag2"]
---
```

3. Write content in MDX (markdown + JSX)
4. Done — auto-appears on `/blog` and in `/sitemap.xml`

---

## Upcoming Features → SEO Action Required

### Voice input (Whisper transcription)

- Update root `description` in `layout.tsx` to mention voice
- Add keyword: `"voice expense tracker"`, `"speak to track expenses"`
- Write blog post: `"How to track expenses by voice with AI"`
- Update JSON-LD description in `page.tsx`

### Receipt image scanning

- Add keywords: `"receipt scanner app"`, `"scan receipt track expense"`, `"AI receipt scanner India"`
- Write blog post: `"Scan your receipts to track expenses automatically"`
- Update landing page hero section copy to mention receipt scanning
- **High SEO value** — "receipt scanner" is a high-volume search term

### PDF bank statement import (Premium)

- Add keywords: `"bank statement expense tracker"`, `"import bank statement"`
- Write blog post: `"How to import your bank statement into an expense tracker"`
- Great for Premium upsell — mention it's a Premium-only feature in the post
- Update the `/premium` page metadata when this launches

---

## Backlinks To-Do (manual, no code)

| Platform                 | Link                                 | Status  |
| ------------------------ | ------------------------------------ | ------- |
| Product Hunt             | https://producthunt.com/posts/new    | Pending |
| IndieHackers             | https://indiehackers.com/post        | Pending |
| Reddit r/india           | https://reddit.com/r/india           | Pending |
| Reddit r/personalfinance | https://reddit.com/r/personalfinance | Pending |
| Reddit r/sideprojects    | https://reddit.com/r/sideprojects    | Pending |
| Reddit r/developersIndia | https://reddit.com/r/developersIndia | Pending |
| Dev.to                   | https://dev.to/new                   | Pending |
| Hashnode                 | https://hashnode.com                 | Pending |
| LinkedIn                 | https://linkedin.com/post/new        | Pending |
| BetaList                 | https://betalist.com/submit          | Pending |
| Microlaunch              | https://microlaunch.net              | Pending |
| Uneed.best               | https://uneed.best/submit            | Pending |

---

## Google Search Console

- Domain: `aixpense.in` — **verified**
- Sitemap submitted: `https://aixpense.in/sitemap.xml`
- www → non-www redirect: **done on Vercel**
- Check indexing status: https://search.google.com/search-console
