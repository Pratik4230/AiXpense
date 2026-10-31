import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPin, Sparkles } from "lucide-react";

import { ApplicationDialog } from "@/components/careers/ApplicationDialog";
import { careerRoles } from "@/components/careers/data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return careerRoles.map((role) => ({ role: role.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: roleId } = await params;
  const role = careerRoles.find((item) => item.id === roleId);
  return { title: role ? `${role.title} at AiXpense` : "Career opportunity at AiXpense", description: role?.summary, alternates: { canonical: `${SITE_URL}/careers/${roleId}` } };
}

export default async function CareerRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;
  const role = careerRoles.find((item) => item.id === roleId);

  if (!role) return <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-bold">Role not found</h1><Link href="/careers" className="mt-6 inline-flex text-primary hover:underline">Back to careers</Link></div>;

  const Icon = role.icon;
  const experienceLabel = "0 to 2 years";
  return <div className="min-h-screen bg-background selection:bg-primary/20"><header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl"><div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6"><Link href="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All careers</Link><Link href="/" className="hidden items-center gap-2 font-bold sm:flex"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></span>AiXpense</Link></div></header>
    <main>
      <section className="border-b border-border/50 bg-muted/20"><div className="container mx-auto px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-4xl"><Link href="/careers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 size-4" />Back to open roles</Link><div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" /></span><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{role.eyebrow}</p></div><h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{role.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{role.summary}</p></div><ApplicationDialog roleTitle={role.title} roleSkills={role.skills.map((skill) => skill.name)} /></div><div className="mt-8 flex flex-wrap gap-2"><span className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">{experienceLabel}</span><span className="rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">Full-time</span><span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"><MapPin className="size-3.5" />India, remote-friendly</span><span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{role.salary}</span></div></div></div></section>

      <section className="container mx-auto grid max-w-5xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_0.8fr]"><div><DetailList title="What you will do" items={role.responsibilities} /><DetailList title="What we are looking for" items={role.idealCandidate} /></div><aside className="space-y-8"><div><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Required skills</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{role.skills.map((skill) => <span key={skill.name} className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground/80">{skill.name}</span>)}</div></div><div className="rounded-3xl border border-primary/20 bg-primary/5 p-6"><h2 className="text-lg font-semibold">What you will get</h2><ul className="mt-4 space-y-3">{role.whatYouGet.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-6 text-foreground/85"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />{item}</li>)}</ul></div><div className="rounded-3xl border border-border/70 bg-card p-6"><p className="text-sm font-semibold">How to apply</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Open the application form above and answer each question in your own words.</p></div></aside></section>
    </main>
    <footer className="border-t border-border/50"><div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-7 text-sm text-muted-foreground sm:flex-row"><p>© 2026 AiXpense. Built with hearts and AI.</p><Link href="/careers" className="hover:text-foreground">View all careers</Link></div></footer>
  </div>;
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return <section className="mb-10"><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2><ul className="mt-5 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-foreground/85 sm:text-base"><CheckCircle2 className="mt-1.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></section>;
}
