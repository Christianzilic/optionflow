"use client";

import { useState, useTransition, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Globe } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        const session = await getSession();
        const role = session?.user?.role;
        if (callbackUrl !== "/") {
          router.push(callbackUrl);
        } else if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "DEVELOPER") {
          router.push("/developer/dashboard");
        } else {
          router.push("/homeowner/dashboard");
        }
        router.refresh();
      }
    });
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0f2240] p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Building2 className="h-6 w-6 text-[#c9a455]" />
          <span className="text-xl font-bold text-white">Devbud.</span>
        </Link>
        <div>
          <p className="text-3xl font-bold text-white leading-snug mb-4">
            Purchase with confidence.<br />
            <span className="text-[#c9a455]">Develop with clarity.</span>
          </p>
          <p className="text-slate-300 text-sm">
            Managing call option deeds for property owners and developers across all Australian states and territories.
          </p>
        </div>
        <p className="text-xs text-slate-500">Finance arranged by All Credit Solutions · 1300 165 360</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#c9a455]" />
              <span className="text-xl font-bold text-[#0f2240]">Devbud.</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#0f2240] mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-7">Sign in to your account</p>

          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-[#c9a455] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full bg-[#0f2240] hover:bg-[#1a3a5c]" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-2">
              or continue with
            </div>
          </div>

          <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50" onClick={handleGoogle}>
            <Globe className="h-4 w-4 mr-2" /> Google
          </Button>

          <p className="text-sm text-slate-500 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#c9a455] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
