"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getEmbeddedSigningUrl } from "@/app/actions/signing";
import { PenLine } from "lucide-react";

export function SignDeedButton({ deedId }: { deedId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const url = await getEmbeddedSigningUrl(deedId, "option");
        window.location.href = url;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to open signing session");
      }
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} className="bg-green-600 hover:bg-green-700">
      <PenLine className="h-4 w-4 mr-2" />
      {isPending ? "Opening…" : "Sign deed"}
    </Button>
  );
}
