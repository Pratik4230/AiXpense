import { baseLayout, actionButton } from "./base";

export function nudgeDay1Email({ name }: { name: string }) {
  const firstName = name?.split(" ")[0] || "there";

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">You haven't added any expenses yet</h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #52525b; line-height: 1.7;">
      Hey ${firstName}, tracking takes less than 5 seconds. Just open the chat and type something like:
    </p>
    <div style="background: #fafaf9; border-left: 3px solid #b45309; border-radius: 6px; padding: 14px 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #3f3f46; font-style: italic; line-height: 1.6;">
        "chai 30"<br />
        "lunch 180 today"<br />
        "petrol 500 yesterday"
      </p>
    </div>
    <p style="margin: 0 0 24px; font-size: 14px; color: #71717a; line-height: 1.7;">That's it. AiXpense handles the rest.</p>
    ${actionButton("Log My First Expense", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${firstName}, you haven't added any expenses yet.\n\nTry: "chai 30" or "lunch 180 today"\n\nLog now: https://aixpense.in/aixpense`,
  };
}

export function nudgeDay3Email({ name }: { name: string }) {
  const firstName = name?.split(" ")[0] || "there";

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">Try voice-style input</h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #52525b; line-height: 1.7;">
      Hey ${firstName}, AiXpense understands natural language — even Hindi-English mix.
    </p>
    <div style="background: #fafaf9; border-left: 3px solid #b45309; border-radius: 6px; padding: 14px 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #3f3f46; font-style: italic; line-height: 1.6;">
        "aaj lunch 200 tha"<br />
        "kal metro 50 spent"<br />
        "grocery 1200 this week"
      </p>
    </div>
    <p style="margin: 0 0 24px; font-size: 14px; color: #71717a; line-height: 1.7;">Your spending story deserves to be told. Start today.</p>
    ${actionButton("Open AiXpense Chat", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${firstName}, try Hinglish: "aaj lunch 200 tha" or "kal metro 50 spent"\n\nOpen chat: https://aixpense.in/aixpense`,
  };
}

export function nudgeDay7Email({ name }: { name: string }) {
  const firstName = name?.split(" ")[0] || "there";

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #18181b;">One week in — where does your money go?</h2>
    <p style="margin: 0 0 20px; font-size: 15px; color: #52525b; line-height: 1.7;">
      Hey ${firstName}, most people have no idea where 30% of their monthly income disappears. AiXpense makes it visible.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; Log in 5 seconds, get insights instantly
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; AI coach summarizes your spending weekly
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-size: 14px; color: #3f3f46;">
          <span style="color: #b45309; font-weight: 600;">✦</span>&nbsp; Set budgets, get alerts before you overspend
        </td>
      </tr>
    </table>
    ${actionButton("Start Tracking Now", "https://aixpense.in/aixpense")}
  `;

  return {
    html: baseLayout(content),
    text: `Hey ${firstName}, one week in — where does your money go?\n\nLog in 5 seconds, get insights instantly.\n\nStart: https://aixpense.in/aixpense`,
  };
}
