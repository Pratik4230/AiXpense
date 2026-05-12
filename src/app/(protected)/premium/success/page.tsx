import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <CheckCircle2 className="size-14 text-green-600 mx-auto" />
        <h1 className="text-2xl font-semibold">Payment received</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Thank you. Premium usually activates within a minute after your
          payment is confirmed. If something still looks off, refresh the app
          or contact support.
        </p>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/aixpense">Continue to AiXpense</Link>
        </Button>
      </div>
    </div>
  );
}
