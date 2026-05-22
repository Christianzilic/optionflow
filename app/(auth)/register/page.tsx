"use client";

import { useState, useTransition, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "developer" ? "DEVELOPER" : "HOMEOWNER";

  const [role, setRole] = useState<"HOMEOWNER" | "DEVELOPER">(defaultRole as "HOMEOWNER" | "DEVELOPER");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("role", role);
    formData.set("tosAccepted", String(tosAccepted));

    startTransition(async () => {
      const result = await registerUser(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Account created! Signing you in…");
      const signInResult = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (signInResult?.ok) {
        router.push(role === "HOMEOWNER" ? "/homeowner/dashboard" : "/developer/dashboard");
      }
    });
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
            Access Australia&apos;s most efficient property option platform — with development finance arranged by All Credit Solutions.
          </p>
        </div>
        <p className="text-xs text-slate-500">Finance arranged by All Credit Solutions · 1300 165 360</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#c9a455]" />
              <span className="text-xl font-bold text-[#0f2240]">Devbud.</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#0f2240] mb-1">Create account</h1>
          <p className="text-sm text-slate-500 mb-6">Join Devbud. to get started</p>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("HOMEOWNER")}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${role === "HOMEOWNER" ? "bg-[#0f2240] text-white border-[#0f2240]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            >
              Property owner
            </button>
            <button
              type="button"
              onClick={() => setRole("DEVELOPER")}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${role === "DEVELOPER" ? "bg-[#c9a455] text-[#0f2240] border-[#c9a455]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            >
              Developer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Jane Smith" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Min. 8 characters" required autoComplete="new-password" minLength={8} />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="tos"
                type="checkbox"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
                required
              />
              <label htmlFor="tos" className="text-xs text-slate-500 leading-tight">
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="text-[#c9a455] underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/legal/disclaimer" target="_blank" className="text-[#c9a455] underline">Legal Disclaimer</Link>.
                I acknowledge this platform does not provide legal advice.
              </label>
            </div>

            <Button type="submit" className="w-full bg-[#0f2240] hover:bg-[#1a3a5c]" disabled={isPending || !tosAccepted}>
              {isPending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c9a455] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
