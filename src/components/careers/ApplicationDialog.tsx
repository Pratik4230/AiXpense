"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Info, LockKeyhole, ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ApplicationDialogProps = {
  roleTitle: string;
  roleSkills: string[];
};

const inputClassName = "h-11 rounded-xl bg-background";

export function ApplicationDialog({ roleTitle, roleSkills }: ApplicationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [copyWarning, setCopyWarning] = React.useState<string | null>(null);
  const warningTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCopyWarning = React.useCallback((fieldName: string) => {
    setCopyWarning(fieldName);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setCopyWarning(null), 3200);
  }, []);

  React.useEffect(() => () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  const blockClipboard = (event: React.ClipboardEvent<HTMLElement>) => {
    event.preventDefault();
    showCopyWarning((event.currentTarget as HTMLInputElement).name);
  };

  const blockKeyboardClipboard = (event: React.KeyboardEvent<HTMLElement>) => {
    if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      showCopyWarning((event.currentTarget as HTMLInputElement).name);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Apply now <ArrowRight className="ml-2 size-4" />
      </button>
      <DialogContent className="max-h-[min(92vh,900px)] max-w-4xl overflow-y-auto rounded-3xl p-5 sm:p-8">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-2xl">Apply for {roleTitle}</DialogTitle>
          <DialogDescription>
            Share your own thinking and experience. There are no perfect answers.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
            <h3 className="mt-4 text-lg font-semibold">Application form complete</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your answers are ready for the secure ₹100 application payment step. After payment confirmation, the application can be sent for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-foreground/85">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p><span className="font-semibold">Please do not copy and paste AI-generated answers.</span> We want to understand your own experience, decisions and way of thinking.</p>
            </div>

            <FormSection title="Basic Details" description="Tell us how we can reach you and which role you are applying for.">
              <Field label="Full name" name="fullName"><Input required name="fullName" autoComplete="name" className={inputClassName} /></Field>
              <Field label="Email address" name="email"><Input required type="email" name="email" autoComplete="email" className={inputClassName} /></Field>
              <Field label="Phone number" name="phone"><Input required type="tel" name="phone" autoComplete="tel" className={inputClassName} /></Field>
              <Field label="Current city and country" name="location"><Input required name="location" placeholder="For example, Pune, India" className={inputClassName} /></Field>
              <Field label="Experience" name="experience"><select required name="experience" className={`${inputClassName} w-full border border-input px-3 text-sm`}><option value="">Select experience</option><option>Fresher</option><option>Less than 1 year</option><option>1 to 2 years</option></select></Field>
              <Field label="Resume link" name="resume"><Input required type="url" name="resume" placeholder="Google Drive or public resume link" className={inputClassName} /></Field>
              <input type="hidden" name="role" value={roleTitle} />
            </FormSection>

            <FormSection title="Role specific questions" description="Answer in your own words. Keep each answer clear and specific.">
              <Field label="What have you built that best demonstrates your skills?" name="bestProject" warning={copyWarning === "bestProject"}><Textarea required name="bestProject" rows={4} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label={`Which of these skills have you used: ${roleSkills.join(", ")}?`} name="skillsUsed" warning={copyWarning === "skillsUsed"}><Textarea required name="skillsUsed" rows={3} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label="Describe one technical problem you solved and how you approached it." name="technicalProblem" warning={copyWarning === "technicalProblem"}><Textarea required name="technicalProblem" rows={4} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label="Why do you want to work at AiXpense?" name="whyAiXpense" warning={copyWarning === "whyAiXpense"}><Textarea required name="whyAiXpense" rows={3} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
            </FormSection>

            <FormSection title="Additional Details" description="A few practical details about working together.">
              <Field label="Availability to join" name="availability"><Input required name="availability" placeholder="For example, immediately or after 30 days" className={inputClassName} /></Field>
              <Field label="Expected annual salary" name="salary"><Input required name="salary" placeholder="For example, ₹5.5L" className={inputClassName} /></Field>
              <Field label="GitHub profile link" name="github"><Input required type="url" name="github" placeholder="https://github.com/your-username" className={inputClassName} /></Field>
              <label className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 text-sm leading-6">
                <input required type="checkbox" name="remoteTimezone" className="mt-1 size-4 accent-primary" />
                <span>I am comfortable working fully remotely and collaborating during India Standard Time, Asia/Kolkata, with reasonable overlap when needed.</span>
              </label>
              <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <input required type="checkbox" name="consent" className="mt-1 size-4 accent-primary" />
                <span>I consent to AiXpense contacting me about this application.</span>
              </label>
            </FormSection>

            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Why we ask for a ₹100 application fee</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">AI tools can now search job portals, tailor resumes, fill forms and submit applications automatically. To reduce automated and low-effort submissions, AiXpense asks candidates to complete a small, non-refundable application commitment fee. This helps us focus review time on candidates who have thoughtfully completed the process.</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">The fee does not guarantee an interview, selection or employment, and it is not refundable after payment.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-primary/15 pt-4 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-4 text-primary" />Secure checkout</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" />Payment details protected</span>
                <span className="inline-flex items-center gap-1.5">₹100 non-refundable</span>
              </div>
            </section>

            <button type="submit" className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Pay ₹100 and apply <ArrowRight className="ml-2 inline size-4" /></button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section><div className="mb-4"><h3 className="text-base font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><div className="flex flex-col gap-4">{children}</div></section>;
}

function Field({ label, name, className, warning, children }: { label: string; name: string; className?: string; warning?: boolean; children: React.ReactNode }) {
  return <div className={`w-full ${className ?? ""}`}><Label htmlFor={name} className="mb-2 block text-sm">{label} <span className="text-destructive">*</span></Label>{children}{warning && <p role="tooltip" className="mt-2 text-xs font-medium text-destructive">Please write your own answers. Do not copy and paste AI-generated answers.</p>}</div>;
}
