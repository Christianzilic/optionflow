"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateHomeownerProfile } from "@/app/actions/developer";

export function UpdateProfileForm({ user, profile }: { user: { name?: string | null; email: string; phone?: string | null }; profile: { legalName?: string | null; abn?: string | null; solicitorName?: string | null; solicitorEmail?: string | null } | null }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateHomeownerProfile(formData);
        toast.success("Profile updated");
      } catch {
        toast.error("Failed to update profile");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <CardHeader><CardTitle className="text-sm">Legal details (for deed documents)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Legal name (as it appears on title)</Label>
            <Input name="legalName" defaultValue={profile?.legalName ?? ""} placeholder="John Smith / Smith Holdings Pty Ltd" />
          </div>
          <div className="space-y-1.5">
            <Label>ABN (if applicable)</Label>
            <Input name="abn" defaultValue={profile?.abn ?? ""} placeholder="12 345 678 901" />
          </div>
          <div className="space-y-1.5">
            <Label>Solicitor name</Label>
            <Input name="solicitorName" defaultValue={profile?.solicitorName ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Solicitor email</Label>
            <Input name="solicitorEmail" type="email" defaultValue={profile?.solicitorEmail ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
