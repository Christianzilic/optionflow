"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateDeveloperProfile } from "@/app/actions/developer";
import { AU_STATES, STATE_LABELS } from "@/lib/property-utils";
import { CheckCircle, Clock } from "lucide-react";

interface Props {
  user: { name?: string | null; email: string; phone?: string | null };
  profile: {
    companyName?: string | null;
    abn?: string | null;
    licenseNumber?: string | null;
    isVerified: boolean;
    preferredStates?: string[];
    preferredMinPrice?: number | null;
    preferredMaxPrice?: number | null;
  } | null;
}

export function DeveloperProfileForm({ user, profile }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateDeveloperProfile(formData);
        toast.success("Profile updated");
      } catch {
        toast.error("Failed to update profile");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 p-4 bg-zinc-50 border rounded-xl">
        {profile?.isVerified ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Verified developer</p>
              <p className="text-xs text-green-700">You have full access to all property information packs.</p>
            </div>
          </>
        ) : (
          <>
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-800">Verification pending</p>
              <p className="text-xs text-zinc-500">Complete your profile and our team will verify you within 1–2 business days.</p>
            </div>
          </>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Personal details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input name="name" defaultValue={user.name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue={user.email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input name="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="+61 4XX XXX XXX" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Company details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Company name</Label>
            <Input name="companyName" defaultValue={profile?.companyName ?? ""} placeholder="Smith Developments Pty Ltd" />
          </div>
          <div className="space-y-1.5">
            <Label>ABN</Label>
            <Input name="abn" defaultValue={profile?.abn ?? ""} placeholder="12 345 678 901" />
          </div>
          <div className="space-y-1.5">
            <Label>Builder's licence number (if applicable)</Label>
            <Input name="licenseNumber" defaultValue={profile?.licenseNumber ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Investment preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Preferred states / territories</Label>
            <div className="grid grid-cols-4 gap-2">
              {AU_STATES.map((state) => (
                <label key={state} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="preferredStates"
                    value={state}
                    defaultChecked={profile?.preferredStates?.includes(state)}
                    className="rounded border-zinc-300"
                  />
                  {state}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Min price (AUD)</Label>
              <Input name="preferredMinPrice" type="number" defaultValue={profile?.preferredMinPrice ? profile.preferredMinPrice / 100 : ""} placeholder="500000" />
            </div>
            <div className="space-y-1.5">
              <Label>Max price (AUD)</Label>
              <Input name="preferredMaxPrice" type="number" defaultValue={profile?.preferredMaxPrice ? profile.preferredMaxPrice / 100 : ""} placeholder="2000000" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
