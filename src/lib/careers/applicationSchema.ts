import { z } from "zod";

const text = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} must be ${max} characters or fewer`);

export const applicationFormSchema = z.object({
  roleId: text(80, "Role"),
  roleTitle: text(120, "Role"),
  fullName: text(100, "Full name"),
  email: z.string().trim().email("Enter a valid email address").max(254, "Email must be 254 characters or fewer").transform((value) => value.toLowerCase()),
  phone: text(30, "Phone number"),
  location: text(120, "Location"),
  experience: z.enum(["Fresher", "Less than 1 year", "1 to 2 years"]),
  resume: z.string().trim().url("Enter a valid resume URL").max(2048, "Resume URL is too long"),
  github: z.string().trim().url("Enter a valid GitHub URL").max(2048, "GitHub URL is too long"),
  bestProject: text(2000, "Project answer"),
  skillsUsed: text(1200, "Skills answer"),
  technicalProblem: text(2000, "Technical problem answer"),
  whyAiXpense: text(1500, "Why AiXpense answer"),
  availability: text(120, "Availability"),
  salary: text(80, "Expected salary"),
  remoteTimezoneConfirmed: z.literal(true, { error: "Remote India timezone confirmation is required" }),
  contactConsent: z.literal(true, { error: "Contact consent is required" }),
  website: z.string().max(100, "Invalid application").optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
