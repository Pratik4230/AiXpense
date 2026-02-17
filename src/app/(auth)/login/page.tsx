import { LoginForm } from "@/components/auth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/icon.png"
              alt="AiXpense Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AiXpense
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered expense tracking
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
