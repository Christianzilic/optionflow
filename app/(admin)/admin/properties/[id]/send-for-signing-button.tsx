"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendOptionDeedForSigning, sendAssignmentDeedForSigning } from "@/app/actions/signing";
import { Send } from "lucide-react";

export function SendForSigningButton({ deedId, deedType }: { deedId: string; deedType: "option" | "assignment" }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        if (deedType === "option") {
          await sendOptionDeedForSigning(deedId);
        } else {
          await sendAssignmentDeedForSigning(deedId);
        }
        toast.success("Deed sent for signing via Docusign");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send for signing");
      }
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} size="sm">
      <Send className="h-4 w-4 mr-2" />
      {isPending ? "Sending…" : "Send for signing"}
    </Button>
  );
}
