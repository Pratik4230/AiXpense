import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout";
import { QueryProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  return (
    <QueryProvider>
      <div className="h-full flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </QueryProvider>
  );
}
