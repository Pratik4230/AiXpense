import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { careerRoles } from "@/components/careers/data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return careerRoles.map((role) => ({ role: role.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: roleId } = await params;
  const role = careerRoles.find((item) => item.id === roleId);

  return {
    title: role ? `Apply for ${role.title} | AiXpense` : "Apply at AiXpense",
    description: role ? `Apply for the ${role.title} role at AiXpense. Remote in India, 0 to 2 years of experience.` : undefined,
    robots: { index: false, follow: true },
  };
}

export default async function CareerApplicationPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;
  const role = careerRoles.find((item) => item.id === roleId);
  if (!role) notFound();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <header className="border-b border-border/60 bg-background/95">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href={`/careers/${role.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to job details
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold sm:text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></span>
            AiXpense
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Careers at AiXpense</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Apply for {role.title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Tell us what you have built and how you think. This application is for developers with 0 to 2 years of experience.
          </p>
        </div>

        <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-10">
          <ApplicationForm roleId={role.id} roleTitle={role.title} roleSkills={role.skills.map((skill) => skill.name)} />

          <aside className="space-y-5 lg:sticky lg:top-8">
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold">About this role</h2>
              <p className="mt-3 text-base font-semibold">{role.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Fully remote in India · Full-time · 0 to 2 years</p>
              <p className="mt-3 text-sm font-medium">{role.salary}</p>
              <Link href={`/careers/${role.id}`} className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">Review the job description</Link>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold">Before you apply</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-2.5"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />Prepare a public resume link and GitHub profile.</li>
                <li className="flex gap-2.5"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />Write the role-specific answers in your own words.</li>
                <li className="flex gap-2.5"><LockKeyhole className="mt-1 size-4 shrink-0 text-primary" />Review the non-refundable application fee before paying securely through Razorpay.</li>
              </ul>
              <p className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" />Secure payment checkout</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
