"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { submitOffer } from "@/app/actions/offers";

export function OfferForm({ propertyId, listPrice }: { propertyId: string; listPrice?: number | null }) {
  const [isPending, startTransition] = useTransition();
  const [legalAck, setLegalAck] = useState(false);
  const [offerPrice, setOfferPrice] = useState(listPrice ? String(listPrice / 100) : "");
  const [deposit, setDeposit] = useState("");
  const [conditions, setConditions] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!legalAck) { toast.error("Please acknowledge the legal disclaimer"); return; }
    startTransition(async () => {
      try {
        await submitOffer({
          propertyId,
          offerPrice: Math.round(parseFloat(offerPrice) * 100),
          depositAmount: deposit ? Math.round(parseFloat(deposit) * 100) : undefined,
          conditions: conditions || undefined,
          legalAckAt: new Date(),
        });
        toast.success("Offer submitted! We will be in touch.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to submit offer");
      }
    });
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Submit an offer</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Offer price (AUD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
              <Input type="number" className="pl-7" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Deposit amount (AUD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
              <Input type="number" className="pl-7" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Conditions / notes</Label>
            <Textarea placeholder="Any special conditions..." value={conditions} onChange={(e) => setConditions(e.target.value)} rows={2} />
          </div>
          <label className="flex items-start gap-2 text-xs text-zinc-500 cursor-pointer">
            <input type="checkbox" checked={legalAck} onChange={(e) => setLegalAck(e.target.checked)} className="mt-0.5 h-4 w-4 rounded" />
            I have read the legal disclaimer and understand this is not legal advice.
          </label>
          <Button type="submit" className="w-full" disabled={isPending || !offerPrice}>
            {isPending ? "Submitting…" : "Submit offer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
