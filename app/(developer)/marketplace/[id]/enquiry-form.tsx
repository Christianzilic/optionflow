"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { submitEnquiry } from "@/app/actions/offers";

export function EnquiryForm({ propertyId }: { propertyId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await submitEnquiry(propertyId, message);
        toast.success("Enquiry sent — we'll be in touch shortly.");
        setMessage("");
      } catch {
        toast.error("Failed to send enquiry");
      }
    });
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Send an enquiry</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Ask a question about this property..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
          />
          <Button type="submit" variant="outline" className="w-full" disabled={isPending || !message.trim()}>
            {isPending ? "Sending…" : "Send enquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
