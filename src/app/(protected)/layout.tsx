import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/layout";

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
    <div className="h-full flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
