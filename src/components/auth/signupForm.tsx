"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown } from "lucide-react";
import { signUp, signIn, authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OAuthButtons } from "./oauthButtons";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode } from "@/constants/currency";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currency) {
      setError("Please select a currency.");
      return;
    }

    setIsLoading(true);

    const { error } = await signUp.email({
      name,
      email,
      password,
      // @ts-expect-error betterAuth additionalFields passed through signUp body
      currency,
      country: selectedCurrency.country,
    });

    if (error) {
      setError(error.message || "Something went wrong");
      setIsLoading(false);
      return;
    }

    setShowOtp(true);
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError("");
    setIsLoading(true);

    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      setError(error.message || "Invalid code");
      setIsLoading(false);
      return;
    }

    await signIn.email({ email, password, callbackURL: "/aixpense" });
    window.location.href = "/aixpense";
  };

  const handleResend = async () => {
    setError("");
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
  };

  if (showOtp) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify your email
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex justify-center overflow-x-auto">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            onClick={handleVerifyOtp}
            className="w-full h-11"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              className="font-medium text-primary hover:underline"
            >
              Resend
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to get started with AiXpense
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons disabled={isLoading} />
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Currency <span className="text-destructive">*</span>
            </Label>
            <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={currencyOpen}
                  className="w-full justify-between h-10"
                  disabled={isLoading}
                  type="button"
                >
                  <span>
                    {selectedCurrency.flag} {selectedCurrency.code} · {selectedCurrency.name}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search currency or country..." />
                  <CommandList>
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {CURRENCIES.map((c) => (
                        <CommandItem
                          key={c.code}
                          value={`${c.code} ${c.name}`}
                          onSelect={() => {
                            setCurrency(c.code as CurrencyCode);
                            setCurrencyOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currency === c.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c.flag} {c.code} · {c.name}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {c.symbol}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Used to display all your expenses. You can change this later.
            </p>
          </div>
          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
