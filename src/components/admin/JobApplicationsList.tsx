"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const STATUSES = ["all", "pending", "viewed", "selected", "joined", "rejected"] as const;
const ROLES = [
  ["all", "All roles"],
  ["fullstack-web-developer", "Full-stack Web Developer"],
  ["agentic-ai-developer", "Agentic AI Developer"],
  ["react-native-developer", "React Native Developer"],
];

type Application = {
  id: string;
  roleTitle: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  resumeUrl: string;
  githubUrl: string;
  answers: Record<string, string>;
  availability: string;
  expectedSalary: string;
  status: string;
  adminNotes?: string;
  payment: { status: string; paymentId?: string; amountInPaise: number };
  createdAt: string;
};

const statusClass: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  viewed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  selected: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  joined: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export function JobApplicationsList() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [status, setStatus] = React.useState("all");
  const [roleId, setRoleId] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Application | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadApplications = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, roleId });
    if (search.trim()) params.set("search", search.trim());
    try {
      const response = await fetch(`/api/admin/job-applications?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load applications");
      setApplications(data.applications);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load applications");
    } finally {
      setLoading(false);
    }
  }, [roleId, search, status]);

  React.useEffect(() => { void loadApplications(); }, [loadApplications]);

  async function updateApplication(id: string, nextStatus: string, adminNotes?: string) {
    const response = await fetch("/api/admin/job-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus, adminNotes }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to update application");
    toast.success("Application updated");
    setSelected(null);
    await loadApplications();
  }

  return <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Admin dashboard</Link><h1 className="text-2xl font-bold">Job Applications</h1><p className="mt-1 text-sm text-muted-foreground">Review paid applications and manage the hiring status.</p></div><Button variant="outline" onClick={() => void loadApplications()}><RefreshCw className="mr-2 size-4" />Refresh</Button></div>
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></div><select value={roleId} onChange={(event) => setRoleId(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">{ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">{STATUSES.map((value) => <option key={value} value={value}>{value === "all" ? "All statuses" : value.replace("_", " ")}</option>)}</select></div>
    {loading ? <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Loading applications...</CardContent></Card> : applications.length === 0 ? <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No applications found.</CardContent></Card> : <div className="space-y-3">{applications.map((application) => <Card key={application.id} className="overflow-hidden"><CardContent className="p-4 sm:p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{application.fullName}</h2><Badge variant="outline" className={statusClass[application.status]}>{application.status}</Badge><Badge variant="outline" className="text-emerald-700">Payment {application.payment.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{application.roleTitle} · {application.email} · {application.location}</p><p className="mt-2 text-xs text-muted-foreground">Applied {new Date(application.createdAt).toLocaleString("en-IN")}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(application)}>View application</Button><select value={application.status} onChange={(event) => void updateApplication(application.id, event.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-xs"><option value="pending">pending</option><option value="viewed">viewed</option><option value="selected">selected</option><option value="joined">joined</option><option value="rejected">rejected</option></select></div></div></CardContent></Card>)}</div>}
    <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>{selected?.fullName} <span className="font-normal text-muted-foreground">· {selected?.roleTitle}</span></DialogTitle></DialogHeader>{selected && <ApplicationDetails application={selected} onSave={updateApplication} />}</DialogContent></Dialog>
  </div>;
}

function ApplicationDetails({ application, onSave }: { application: Application; onSave: (id: string, status: string, notes?: string) => Promise<void> }) {
  const [status, setStatus] = React.useState(application.status);
  const [notes, setNotes] = React.useState(application.adminNotes ?? "");
  return <div className="space-y-6 text-sm"><div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2"><p><span className="text-muted-foreground">Email:</span> {application.email}</p><p><span className="text-muted-foreground">Phone:</span> {application.phone}</p><p><span className="text-muted-foreground">Location:</span> {application.location}</p><p><span className="text-muted-foreground">Experience:</span> {application.experience}</p><p><span className="text-muted-foreground">Availability:</span> {application.availability}</p><p><span className="text-muted-foreground">Expected salary:</span> {application.expectedSalary}</p></div><div className="flex flex-wrap gap-3"><a href={application.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">Resume <ExternalLink className="size-3.5" /></a><a href={application.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">GitHub <ExternalLink className="size-3.5" /></a></div><div className="space-y-4">{[["Best project", application.answers.bestProject], ["Skills used", application.answers.skillsUsed], ["Technical problem", application.answers.technicalProblem], ["Why AiXpense", application.answers.whyAiXpense]].map(([label, answer]) => <div key={label}><p className="font-medium">{label}</p><p className="mt-1 whitespace-pre-wrap leading-6 text-muted-foreground">{answer}</p></div>)}</div><div className="space-y-3 border-t border-border/60 pt-5"><label className="block text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3"><option>pending</option><option>viewed</option><option>selected</option><option>joined</option><option>rejected</option></select></label><label className="block text-sm font-medium">Internal notes<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-24" placeholder="Private admin notes" /></label><Button onClick={() => void onSave(application.id, status, notes)}>Save application</Button></div></div>;
}
