import { baseLayout, heading, infoBox, infoRow, infoRowLast, link, mutedParagraph, paragraph } from "./base";

type JobApplicationEmailOptions = {
  applicationId: string;
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  resumeUrl: string;
  githubUrl: string;
  amount: number;
  paymentId: string;
  answers: {
    bestProject: string;
    skillsUsed: string;
    technicalProblem: string;
    whyAiXpense: string;
  };
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function money(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function details(options: JobApplicationEmailOptions) {
  return infoBox(`
    ${infoRow("Application ID", escapeHtml(options.applicationId))}
    ${infoRow("Role", escapeHtml(options.roleTitle))}
    ${infoRow("Payment", money(options.amount))}
    ${infoRowLast("Payment ID", escapeHtml(options.paymentId))}
  `);
}

export function jobApplicationCandidateEmail(options: JobApplicationEmailOptions) {
  const content = `
    ${heading("Application received")}
    ${paragraph(`Hi ${escapeHtml(options.fullName)},`)}
    ${paragraph(`Thank you for applying for the ${escapeHtml(options.roleTitle)} role at AiXpense. Your payment has been captured and your application is now pending review.`)}
    ${details(options)}
    ${mutedParagraph("Our team will review your application and contact you if your profile moves forward.")}
  `;

  return {
    subject: `AiXpense application received: ${options.roleTitle}`,
    html: baseLayout(`${content}<p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.6;">Questions? Visit ${link("https://aixpense.in/contact", "AiXpense contact")}</p>`),
  };
}

export function jobApplicationAdminEmail(options: JobApplicationEmailOptions) {
  const content = `
    ${heading("New paid job application")}
    ${paragraph(`A candidate has completed a paid application for the ${escapeHtml(options.roleTitle)} role.`)}
    ${details(options)}
    ${infoBox(`
      ${infoRow("Candidate", escapeHtml(options.fullName))}
      ${infoRow("Email", escapeHtml(options.email))}
      ${infoRow("Phone", escapeHtml(options.phone))}
      ${infoRowLast("Location", escapeHtml(options.location))}
    `)}
    ${paragraph(`<strong>Experience:</strong> ${escapeHtml(options.experience)}<br /><strong>Resume:</strong> ${link(options.resumeUrl, "Open resume")}<br /><strong>GitHub:</strong> ${link(options.githubUrl, "Open GitHub")}`)}
    ${paragraph(`<strong>Best project</strong><br />${escapeHtml(options.answers.bestProject)}<br /><br /><strong>Skills used</strong><br />${escapeHtml(options.answers.skillsUsed)}<br /><br /><strong>Technical problem</strong><br />${escapeHtml(options.answers.technicalProblem)}<br /><br /><strong>Why AiXpense</strong><br />${escapeHtml(options.answers.whyAiXpense)}`)}
  `;

  return {
    subject: `New paid application: ${options.roleTitle} | ${options.fullName}`,
    html: baseLayout(content),
  };
}
