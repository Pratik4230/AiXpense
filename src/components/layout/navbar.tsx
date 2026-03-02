"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/modeToggle";
import { signOut, useSession } from "@/lib/authClient";
import { ReportIssueDialog } from "@/components/report-issue/ReportIssueDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const emptySubscribe = () => () => {};

const navLinks = [
  { href: "/aixpense", label: "AiXpense" },
  { href: "/budgets", label: "Budgets" },
  { href: "/reports", label: "Reports" },
  { href: "/transactions", label: "Transactions" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const userInitial =
    session?.user?.name?.[0]?.toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl border-b border-border/50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative container mx-auto px-4">
        <div className="flex h-15 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/aixpense" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm group-hover:blur-md transition-all" />
                <Image
                  src="/icon.png"
                  alt="AiXpense Logo"
                  width={30}
                  height={30}
                  className="relative w-7.5 h-7.5 rounded-lg"
                  priority
                />
              </div>
              <span className="text-lg font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                AiXpense
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20" />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {mounted && session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-border/60 bg-muted/40 hover:bg-muted/80 hover:border-border transition-all duration-200 group">
                    <div className="size-7 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                      {userInitial}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground max-w-32 truncate transition-colors">
                      {session.user.name ?? session.user.email}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="size-4 mr-2" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ReportIssueDialog>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <MessagesSquare className="size-4 mr-2" /> Feedback
                    </DropdownMenuItem>
                  </ReportIssueDialog>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-1">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                      isActive
                        ? "bg-primary/10 text-foreground border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground">Theme</span>
                <ModeToggle />
              </div>
              {mounted && session?.user && (
                <div className="grid grid-cols-2 gap-1">
                  <Link href="/profile" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="size-4 mr-1.5" /> Profile
                    </Button>
                  </Link>
                  <ReportIssueDialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <MessagesSquare className="size-4 mr-1.5" /> Feedback
                    </Button>
                  </ReportIssueDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start text-destructive hover:text-destructive col-span-2"
                  >
                    <LogOut className="size-4 mr-1.5" /> Sign out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
