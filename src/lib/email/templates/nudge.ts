import {
  actionButton,
  baseLayout,
  callout,
  greeting,
  heading,
  mutedParagraph,
  paragraph,
  bulletList,
} from "./base";

export function nudgeDay1Email({ name }: { name: string }) {
  const content = `
    ${heading("You haven't added any expenses yet")}
    ${greeting(name)}
    ${paragraph("Tracking takes less than 5 seconds. Open the chat and type something like:")}
    ${callout('"chai 30"<br />"lunch 180 today"<br />"petrol 500 yesterday"')}
    ${mutedParagraph("That's it. AiXpense handles the rest.")}
    ${actionButton("Log My First Expense", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${name?.split(" ")[0] || "there"}, you haven't added any expenses yet.\n\nTry: "chai 30" or "lunch 180 today"\n\nLog now: https://aixpense.in/aixpense`,
  };
}

export function nudgeDay3Email({ name }: { name: string }) {
  const content = `
    ${heading("Try voice-style input")}
    ${greeting(name)}
    ${paragraph("AiXpense understands natural language, even Hindi-English mix.")}
    ${callout('"aaj lunch 200 tha"<br />"kal metro 50 spent"<br />"grocery 1200 this week"')}
    ${mutedParagraph("Your spending story deserves to be told. Start today.")}
    ${actionButton("Open AiXpense Chat", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${name?.split(" ")[0] || "there"}, try Hinglish: "aaj lunch 200 tha" or "kal metro 50 spent"\n\nOpen chat: https://aixpense.in/aixpense`,
  };
}

export function nudgeDay7Email({ name }: { name: string }) {
  const content = `
    ${heading("One week in: where does your money go?")}
    ${greeting(name)}
    ${paragraph("Most people have no idea where 30% of their monthly income disappears. AiXpense makes it visible.")}
    ${bulletList([
      "Log in 5 seconds, get insights instantly",
      "AI coach summarizes your spending weekly",
      "Set budgets and get alerts before you overspend",
    ])}
    ${actionButton("Start Tracking Now", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${name?.split(" ")[0] || "there"}, one week in: where does your money go?\n\nLog in 5 seconds, get insights instantly.\n\nStart: https://aixpense.in/aixpense`,
  };
}
