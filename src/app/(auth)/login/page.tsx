import { Metadata } from "next";
import { LoginForm } from "@/components/auth";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AiXpense account to track expenses with AI.",
  alternates: { canonical: "https://aixpense.in/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Image
              src="/icon.png"
              alt="AiXpense Logo"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AiXpense
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            AI-powered expense tracking
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
