"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { approveProperty, rejectProperty } from "@/app/actions/properties";
import type { PropertyStatus } from "@/lib/generated/prisma/client";
import { CheckCircle, XCircle, FileText, Tag, Store } from "lucide-react";
import Link from "next/link";

interface Props {
  property: { id: string; status: PropertyStatus; optionDeedId?: string | null };
}

export function AdminPropertyActions({ property }: Props) {
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveProperty(property.id, notes || undefined);
        toast.success("Property approved");
      } catch {
        toast.error("Failed to approve property");
      }
    });
  }

  function handleReject() {
    if (!notes.trim()) { toast.error("Please provide a reason for rejection"); return; }
    startTransition(async () => {
      try {
        await rejectProperty(property.id, notes);
        toast.success("Property rejected");
      } catch {
        toast.error("Failed to reject property");
      }
    });
  }

  const showReview = ["SUBMITTED", "UNDER_REVIEW"].includes(property.status);
  const showOptionDeed = ["APPROVED"].includes(property.status);
  const showList = ["OPTION_ACTIVE"].includes(property.status);
  const showAssignment = ["LISTED", "OFFER_RECEIVED", "UNDER_NEGOTIATION"].includes(property.status);

  if (!showReview && !showOptionDeed && !showList && !showAssignment) return null;

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-zinc-800 text-sm">Actions</h3>

      {showReview && (
        <>
          <Textarea
            placeholder="Admin notes (required for rejection, optional for approval)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <div className="flex gap-3">
            <Button onClick={handleApprove} disabled={isPending} className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" /> Approve
            </Button>
            <Button onClick={handleReject} disabled={isPending} variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </Button>
          </div>
        </>
      )}

      {showOptionDeed && (
        <Link href={`/admin/properties/${property.id}/option-deed`}>
          <Button className="w-full">
            <FileText className="h-4 w-4 mr-2" /> Generate option deed
          </Button>
        </Link>
      )}

      {showList && (
        <Link href={`/admin/properties/${property.id}/list`}>
          <Button className="w-full">
            <Store className="h-4 w-4 mr-2" /> List on marketplace
          </Button>
        </Link>
      )}

      {showAssignment && (
        <Link href={`/admin/properties/${property.id}/assignment-deed`}>
          <Button className="w-full" variant="outline">
            <Tag className="h-4 w-4 mr-2" /> Generate assignment deed
          </Button>
        </Link>
      )}
    </div>
  );
}
