import { BriefcaseBusiness, Code2, Sparkles } from "lucide-react";

export type CareerRole = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  icon: typeof Code2;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  seoKeywords: string[];
  seoTitle: string;
  skills: Array<{ name: string; mark: string; tone: string }>;
  responsibilities: string[];
  idealCandidate: string[];
  whatYouGet: string[];
};

export const careerRoles: CareerRole[] = [
  {
    id: "fullstack-web-developer",
    title: "Full-stack Web Developer",
    eyebrow: "Product engineering",
    summary: "Build the web experience that turns everyday money tracking into a simple, intelligent conversation.",
    icon: Code2,
    salary: "₹4.8L to ₹5.8L per annum",
    salaryMin: 480000,
    salaryMax: 580000,
    seoKeywords: ["full stack developer jobs India", "React developer jobs for freshers", "Next.js developer jobs", "Node.js developer jobs", "junior web developer jobs"],
    seoTitle: "Full-stack Web Developer Jobs in India",
    skills: [{ name: "TypeScript", mark: "TS", tone: "bg-blue-500/10 text-blue-600" }, { name: "React", mark: "⚛", tone: "bg-cyan-500/10 text-cyan-600" }, { name: "Next.js", mark: "N", tone: "bg-foreground/10 text-foreground" }, { name: "Node.js", mark: "JS", tone: "bg-green-500/10 text-green-600" }, { name: "Tailwind CSS", mark: "TW", tone: "bg-sky-500/10 text-sky-600" }, { name: "MongoDB", mark: "MDB", tone: "bg-emerald-500/10 text-emerald-600" }, { name: "REST APIs", mark: "API", tone: "bg-orange-500/10 text-orange-600" }],
    responsibilities: ["Build and maintain features across chat-based expense capture, budgets, reports and recurring payments.", "Create accessible, responsive React and Next.js interfaces that feel fast and intuitive on mobile and desktop.", "Design and consume Node.js REST APIs, work with MongoDB-backed services, and keep data flows reliable and secure.", "Collaborate with product and design to turn ideas into shippable experiences, then improve them after launch.", "Write maintainable code, tests and documentation, and participate in thoughtful code reviews."],
    idealCandidate: ["Has built a meaningful project with React or Next.js. Personal, academic or freelance work counts.", "Understands component design, async JavaScript, HTTP APIs and basic database concepts.", "Cares about product details and can explain the decisions behind their implementation."],
    whatYouGet: ["Learn by shipping real production features", "Ownership of work used by AiXpense customers", "Feedback on code, architecture and product decisions", "Grow with a product serving a growing customer base"],
  },
  {
    id: "agentic-ai-developer",
    title: "Agentic AI Developer",
    eyebrow: "AI product engineering",
    summary: "Work on the intelligence behind AiXpense: agents that understand natural language, take safe actions and make financial data useful.",
    icon: Sparkles,
    salary: "₹5.4L to ₹6.0L per annum",
    salaryMin: 540000,
    salaryMax: 600000,
    seoKeywords: ["AI developer jobs India", "agentic AI developer jobs", "AI engineer jobs for freshers", "OpenAI developer jobs", "LLM application developer jobs"],
    seoTitle: "AI Developer Jobs in India",
    skills: [{ name: "OpenAI APIs", mark: "AI", tone: "bg-emerald-500/10 text-emerald-600" }, { name: "Sarvam AI", mark: "SA", tone: "bg-violet-500/10 text-violet-600" }, { name: "Vercel AI SDK", mark: "VA", tone: "bg-foreground/10 text-foreground" }, { name: "TypeScript", mark: "TS", tone: "bg-blue-500/10 text-blue-600" }, { name: "Tool calling", mark: "⌘", tone: "bg-orange-500/10 text-orange-600" }, { name: "Evaluations", mark: "✓", tone: "bg-amber-500/10 text-amber-600" }],
    responsibilities: ["Build agent workflows that translate natural-language messages into accurate expense, income, budget and report actions.", "Design tool schemas, prompts and fallback paths that make AI behaviour predictable and safe for financial data.", "Improve multilingual input, receipt understanding, insights and semantic search over past expenses.", "Create evaluation sets and monitor quality, latency, token usage and failure modes in production.", "Partner with web and mobile engineers to deliver clear loading, streaming, error and recovery states."],
    idealCandidate: ["Has experimented with LLM APIs, agents, RAG, tool calling or structured extraction.", "Enjoys testing hypotheses with data and understands that reliable AI needs evaluation.", "Can reason about permissions, privacy and failure cases when software works with personal finances."],
    whatYouGet: ["Learn to ship reliable AI workflows in production", "A chance to shape evaluation and observability practices", "Mentorship in agent, tool and prompt design", "Grow with a product serving a growing customer base"],
  },
  {
    id: "react-native-developer",
    title: "React Native Developer",
    eyebrow: "Mobile engineering",
    summary: "Shape the Android experience for capturing expenses anywhere by chat, voice, camera and quick actions.",
    icon: BriefcaseBusiness,
    salary: "₹4.8L to ₹6.0L per annum",
    salaryMin: 480000,
    salaryMax: 600000,
    seoKeywords: ["React Native developer jobs India", "React Native jobs for freshers", "Expo developer jobs", "mobile app developer jobs", "junior mobile developer jobs"],
    seoTitle: "React Native Developer Jobs in India",
    skills: [{ name: "React Native", mark: "RN", tone: "bg-cyan-500/10 text-cyan-600" }, { name: "Expo", mark: "EX", tone: "bg-foreground/10 text-foreground" }, { name: "EAS", mark: "EAS", tone: "bg-violet-500/10 text-violet-600" }, { name: "Expo Notifications", mark: "✦", tone: "bg-orange-500/10 text-orange-600" }, { name: "TypeScript", mark: "TS", tone: "bg-blue-500/10 text-blue-600" }, { name: "Offline sync", mark: "↻", tone: "bg-emerald-500/10 text-emerald-600" }],
    responsibilities: ["Build and maintain features in the AiXpense Android app, including chat, voice capture, receipt scanning, budgets and reports.", "Deliver resilient mobile flows with offline queueing, retry states and network recovery.", "Integrate share intent, biometric app lock, home-screen widgets and Play Store update prompts.", "Pay attention to performance, accessibility, permissions and production release workflows.", "Work with the web and AI teams to keep mobile conversations and account data consistent."],
    idealCandidate: ["Has shipped or prototyped a React Native or Expo app and can test on Android.", "Understands state, navigation, asynchronous work and mobile network constraints.", "Is curious about native Android behaviour and willing to learn beyond JavaScript."],
    whatYouGet: ["Learn by shipping production Android features", "Mentorship across React Native and native integrations", "Ownership of offline-first and mobile interaction flows", "Grow with a product serving a growing customer base"],
  },
];
