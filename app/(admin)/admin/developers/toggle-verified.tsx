"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleDeveloperVerified } from "./actions";

export function ToggleVerifiedButton({ profileId, isVerified }: { profileId: string; isVerified: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await toggleDeveloperVerified(profileId, isVerified);
        toast.success(isVerified ? "Developer unverified" : "Developer verified");
      } catch {
        toast.error("Failed to update verification");
      }
    });
  }

  return (
    <Button onClick={handleClick} variant="outline" size="sm" disabled={isPending}>
      {isPending ? "Updating…" : isVerified ? "Unverify" : "Verify"}
    </Button>
  );
}
