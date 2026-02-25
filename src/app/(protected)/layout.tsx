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

  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
