"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Info, LockKeyhole, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applicationFormSchema } from "@/lib/careers/applicationSchema";

type ApplicationFormProps = {
  roleId: string;
  roleTitle: string;
  roleSkills: string[];
};

type ApplicationFee = { amountInPaise: number; isAdminTest: boolean };

type ApplicationConfirmation = {
  applicationId: string;
  paymentId: string;
};

const inputClassName = "h-11 rounded-xl bg-background";

export function ApplicationForm({ roleId, roleTitle, roleSkills }: ApplicationFormProps) {
  const [fee, setFee] = React.useState<ApplicationFee | null>(null);
  const [feeError, setFeeError] = React.useState<string | null>(null);
  const [feeRetry, setFeeRetry] = React.useState(0);
  const feeLabel = fee ? `₹${fee.amountInPaise / 100}` : null;
  const [submitted, setSubmitted] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<ApplicationConfirmation | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [copyWarning, setCopyWarning] = React.useState<string | null>(null);
  const warningTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const validationForm = useForm({
    defaultValues: {
      roleId,
      roleTitle,
      fullName: "",
      email: "",
      phone: "",
      location: "",
      experience: "Fresher",
      resume: "",
      github: "",
      bestProject: "",
      skillsUsed: "",
      technicalProblem: "",
      whyAiXpense: "",
      availability: "",
      salary: "",
      remoteTimezoneConfirmed: false,
      contactConsent: false,
      website: "",
    },
    onSubmit: async () => undefined,
  });

  const showCopyWarning = React.useCallback((fieldName: string) => {
    setCopyWarning(fieldName);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    warningTimer.current = setTimeout(() => setCopyWarning(null), 3200);
  }, []);

  React.useEffect(() => () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    setFeeError(null);
    fetch("/api/careers/applications/fee", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load the application fee");
        const quote = await response.json() as ApplicationFee;
        if (!Number.isSafeInteger(quote.amountInPaise) || quote.amountInPaise < 100 || quote.amountInPaise % 100 !== 0) {
          throw new Error("Invalid application fee");
        }
        setFee(quote);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setFeeError(error instanceof Error ? error.message : "Unable to load the application fee");
      });
    return () => controller.abort();
  }, [feeRetry]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fee) {
      setFormError("Please wait for the application fee to load before paying.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    try {
      const form = event.currentTarget;
      const rawValues = Object.fromEntries(new FormData(form).entries());
      const parsed = applicationFormSchema.safeParse({
        ...rawValues,
        roleId,
        roleTitle,
        remoteTimezoneConfirmed: rawValues.remoteTimezone === "on",
        contactConsent: rawValues.consent === "on",
      });
      if (!parsed.success) {
        setSubmitting(false);
        setFormError(parsed.error.issues[0]?.message ?? "Please check the application fields");
        return;
      }
      const values = parsed.data;
      validationForm.setFieldValue("fullName", values.fullName);
      validationForm.setFieldValue("email", values.email);
      validationForm.setFieldValue("phone", values.phone);
      validationForm.setFieldValue("location", values.location);
      validationForm.setFieldValue("experience", values.experience);
      validationForm.setFieldValue("resume", values.resume);
      validationForm.setFieldValue("github", values.github);
      validationForm.setFieldValue("bestProject", values.bestProject);
      validationForm.setFieldValue("skillsUsed", values.skillsUsed);
      validationForm.setFieldValue("technicalProblem", values.technicalProblem);
      validationForm.setFieldValue("whyAiXpense", values.whyAiXpense);
      validationForm.setFieldValue("availability", values.availability);
      validationForm.setFieldValue("salary", values.salary);
      validationForm.setFieldValue("remoteTimezoneConfirmed", values.remoteTimezoneConfirmed);
      validationForm.setFieldValue("contactConsent", values.contactConsent);
      const checkoutScript = loadRazorpayScript();
      void checkoutScript.catch(() => undefined);
      const orderResponse = await fetch("/api/careers/applications/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
        }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || "Unable to start payment");
      if (orderData.amount !== fee.amountInPaise) throw new Error("The application fee changed. Please refresh this page before paying.");

      await checkoutScript;
      if (!window.Razorpay) throw new Error("Razorpay Checkout could not be loaded");

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AiXpense",
        description: "AiXpense job application fee",
        order_id: orderData.orderId,
        prefill: {
          name: String(values.fullName),
          email: String(values.email),
          contact: String(values.phone),
        },
        notes: { role: roleTitle },
        theme: { color: "#ff6b00" },
        handler: async (payment) => {
          try {
            const verificationResponse = await fetch("/api/careers/applications/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                applicationId: orderData.applicationId,
                razorpayOrderId: payment.razorpay_order_id,
                razorpayPaymentId: payment.razorpay_payment_id,
                razorpaySignature: payment.razorpay_signature,
              }),
            });
            const verificationData = await verificationResponse.json();
            if (!verificationResponse.ok) throw new Error(verificationData.error || "Payment verification failed");
            setConfirmation(verificationData);
            setSubmitted(true);
          } catch (error) {
            setFormError(error instanceof Error ? error.message : "Payment verification failed");
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });

      checkout.open();
    } catch (error) {
      setSubmitting(false);
      setFormError(error instanceof Error ? error.message : "Unable to start payment");
    }
  };

  return (
    <div className="min-w-0 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Your application</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Apply for {roleTitle}. Share your own thinking and experience. There are no perfect answers.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
            <h3 className="mt-4 text-lg font-semibold">Application form complete</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your payment was captured and your application is now pending review. A confirmation email is being sent to you, and our team has been notified.</p>
            {confirmation && <div className="mt-5 rounded-xl border border-border/70 bg-background/70 p-4 text-left text-sm"><p><span className="font-medium">Application ID:</span> {confirmation.applicationId}</p><p className="mt-2"><span className="font-medium">Payment ID:</span> {confirmation.paymentId}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">Your confirmation emails are queued securely for delivery.</p></div>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-foreground/85">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <p><span className="font-semibold">Please do not copy and paste AI-generated answers.</span> We want to understand your own experience, decisions and way of thinking.</p>
            </div>

            <FormSection title="Basic Details" description="Tell us how we can reach you and which role you are applying for.">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <Field label="Full name" name="fullName"><Input required id="fullName" name="fullName" autoComplete="name" maxLength={100} className={inputClassName} /></Field>
              <Field label="Email address" name="email"><Input required id="email" type="email" name="email" autoComplete="email" maxLength={254} className={inputClassName} /></Field>
              <Field label="Phone number" name="phone"><Input required id="phone" type="tel" name="phone" maxLength={30} autoComplete="tel" className={inputClassName} /></Field>
              <Field label="Current city and country" name="location"><Input required id="location" name="location" placeholder="For example, Pune, India" maxLength={120} className={inputClassName} /></Field>
              <Field label="Experience" name="experience"><select required id="experience" name="experience" className={`${inputClassName} w-full border border-input px-3 text-sm`}><option value="">Select experience</option><option>Fresher</option><option>Less than 1 year</option><option>1 to 2 years</option></select></Field>
              <Field label="Resume link" name="resume"><Input required id="resume" type="url" name="resume" placeholder="Google Drive or public resume link" maxLength={2048} className={inputClassName} /></Field>
              <input type="hidden" name="role" value={roleTitle} />
            </FormSection>

            <FormSection title="Role specific questions" description="Answer in your own words. Keep each answer clear and specific.">
              <Field label="What have you built that best demonstrates your skills?" name="bestProject" warning={copyWarning === "bestProject"}><Textarea required id="bestProject" name="bestProject" rows={4} maxLength={2000} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label={`Which of these skills have you used: ${roleSkills.join(", ")}?`} name="skillsUsed" warning={copyWarning === "skillsUsed"}><Textarea required id="skillsUsed" name="skillsUsed" rows={3} maxLength={1200} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label="Describe one technical problem you solved and how you approached it." name="technicalProblem" warning={copyWarning === "technicalProblem"}><Textarea required id="technicalProblem" name="technicalProblem" rows={4} maxLength={2000} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
              <Field label="Why do you want to work at AiXpense?" name="whyAiXpense" warning={copyWarning === "whyAiXpense"}><Textarea required id="whyAiXpense" name="whyAiXpense" rows={3} maxLength={1500} className="w-full rounded-xl bg-background" onPaste={blockClipboard} onCopy={blockClipboard} onCut={blockClipboard} onKeyDown={blockKeyboardClipboard} /></Field>
            </FormSection>

            <FormSection title="Additional Details" description="A few practical details about working together.">
              <Field label="Availability to join" name="availability"><Input required id="availability" name="availability" placeholder="For example, immediately or after 30 days" maxLength={120} className={inputClassName} /></Field>
              <Field label="Expected annual salary" name="salary"><Input required id="salary" name="salary" placeholder="For example, ₹5.5L" maxLength={80} className={inputClassName} /></Field>
              <Field label="GitHub profile link" name="github"><Input required id="github" type="url" name="github" placeholder="https://github.com/your-username" maxLength={2048} className={inputClassName} /></Field>
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
                  <h3 className="font-semibold">Why we ask for an application fee</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">AI tools can now search job portals, tailor resumes, fill forms and submit applications automatically. To reduce automated and low-effort submissions, AiXpense asks candidates to complete a small, non-refundable application commitment fee. This helps us focus review time on candidates who have thoughtfully completed the process.</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">The fee does not guarantee an interview, selection or employment, and it is not refundable after payment.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-primary/15 pt-4 text-xs font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-4 text-primary" />Secure checkout</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" />Payment details protected</span>
                <span className="inline-flex items-center gap-1.5">{feeLabel ? `${feeLabel} non-refundable` : "Checking fee..."}</span>
              </div>
              {fee?.isAdminTest && <p className="mt-4 text-xs font-medium text-primary">Admin test pricing applies to your signed-in account.</p>}
              {feeError && <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 text-sm text-destructive"><span>{feeError}</span><button type="button" onClick={() => setFeeRetry((current) => current + 1)} className="font-semibold underline underline-offset-2">Retry</button></div>}
            </section>

            {formError && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{formError}</p>}
            <button type="submit" disabled={submitting || !fee} className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Opening secure checkout..." : feeLabel ? `Pay ${feeLabel} and apply` : "Checking application fee..."} {!submitting && feeLabel && <ArrowRight className="ml-2 inline size-4" />}</button>
          </form>
        )}
    </div>
  );
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("Razorpay Checkout could not be loaded"));
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
    document.body.appendChild(script);
  }).catch((error) => {
    razorpayScriptPromise = null;
    document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')?.remove();
    throw error;
  });

  return razorpayScriptPromise;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes: { role: string };
  theme: { color: string };
  handler: (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
};

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section><div className="mb-4"><h3 className="text-base font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><div className="flex flex-col gap-4">{children}</div></section>;
}

function Field({ label, name, className, warning, children }: { label: string; name: string; className?: string; warning?: boolean; children: React.ReactNode }) {
  return <div className={`w-full ${className ?? ""}`}><Label htmlFor={name} className="mb-2 block text-sm">{label} <span className="text-destructive">*</span></Label>{children}{warning && <p role="tooltip" className="mt-2 text-xs font-medium text-destructive">Please write your own answers. Do not copy and paste AI-generated answers.</p>}</div>;
}
