import { PLAY_STORE_URL } from "@/constants/play-store";

export const LANDING_FAQS = [
  {
    q: "Does AiXpense require a subscription?",
    a: "Yes. An active Premium subscription is required to use AiXpense features. Choose a monthly or yearly plan from the secure checkout before using the app.",
  },
  {
    q: "Does it work in Hindi, Marathi, or Hinglish?",
    a: "Yes. AiXpense supports voice input in 22+ Indian languages via Sarvam AI, including Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, and more, plus Hinglish codemix. You can also type in any of these languages.",
  },
  {
    q: "How is my financial data kept safe?",
    a: "We never share or sell your data. You can delete your account and all associated data at any time.",
  },
  {
    q: "What exactly does the AI do?",
    a: 'When you type or say something like "Uber to airport 650", the AI extracts the item name, amount, date, category, and tags and saves them instantly. No forms to fill.',
  },
  {
    q: "Can I use it on my phone?",
    a: `Yes. Install AiXpense for Android from Google Play (${PLAY_STORE_URL}) for voice input in 22+ Indian languages, bill scanning, and a native mobile experience - or use the web app in any mobile browser with the same account.`,
  },
  {
    q: "What does Premium include?",
    a: "Premium includes unlimited AI conversations, spending insights and charts, shareable report cards, recurring payment tracking, AI receipt and bill scanning, and priority support.",
  },
  {
    q: "Do I need to log every expense manually?",
    a: "No. For everyday spends you describe them once in chat and AiXpense structures them. For bills that repeat - subscriptions, rent, EMIs - Premium recurring rules can add those on a schedule so you are not retyping the same entry every month. You can always search, edit, or delete entries later.",
  },
  {
    q: "Is this better than a notes app or Google Sheets?",
    a: "Notes and Sheets are flexible, but you still do all the work: columns, formulas, and remembering to update them. AiXpense is built as a ledger: categories, tags, budgets, reports, and voice or chat input in one place - so totals and trends stay consistent without maintaining a spreadsheet.",
  },
  {
    q: "Which currencies does AiXpense support?",
    a: "AiXpense supports dozens of account currencies (INR, USD, EUR, GBP, AED, SGD, and many more). Your ledger, budgets, and reports use the currency you choose. After sign-up, open Profile (Settings) to switch your account currency.",
  },
] as const;
