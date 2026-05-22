"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createAssignmentDeed } from "@/app/actions/deeds";
import { formatAud } from "@/lib/property-utils";

interface Props {
  propertyId: string;
  optionDeed: { optionPrice: number; optionFeeAmount: number; grantee_legalName: string; grantee_address: string };
  acceptedOffer: { offerPrice: number; developer: { name?: string | null; email: string } } | null;
}

export function AssignmentDeedForm({ propertyId, optionDeed, acceptedOffer }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const assignmentPrice = Math.round(parseFloat(fd.get("assignmentPrice") as string) * 100);
    const developerDeposit = Math.round(parseFloat(fd.get("developerDeposit") as string) * 100);
    const margin = assignmentPrice - optionDeed.optionPrice - optionDeed.optionFeeAmount;

    startTransition(async () => {
      try {
        await createAssignmentDeed({
          propertyId,
          assignee_legalName: fd.get("assignee_legalName") as string,
          assignee_abn: (fd.get("assignee_abn") as string) || undefined,
          assignee_address: fd.get("assignee_address") as string,
          assignmentPrice,
          developerDeposit,
          assignmentDate: new Date(fd.get("assignmentDate") as string),
          completionDate: new Date(fd.get("completionDate") as string),
        });
        toast.success("Assignment deed generated");
        router.push(`/admin/properties/${propertyId}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to generate deed");
      }
    });
  }

  const estimatedMargin = acceptedOffer
    ? acceptedOffer.offerPrice - optionDeed.optionPrice - optionDeed.optionFeeAmount
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {acceptedOffer && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-green-800">Accepted offer from {acceptedOffer.developer.name ?? acceptedOffer.developer.email}</p>
            <p className="text-lg font-bold text-green-900">{formatAud(acceptedOffer.offerPrice)}</p>
            {estimatedMargin !== null && (
              <p className="text-xs text-green-700 mt-1">
                Estimated margin: {formatAud(estimatedMargin)} (after option price + fee)
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">Assignor (you / platform)</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-500">Legal name</span><span>{optionDeed.grantee_legalName}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">Address</span><span className="text-right max-w-[60%]">{optionDeed.grantee_address}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Assignee (developer)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Legal name *</Label>
            <Input name="assignee_legalName" defaultValue={acceptedOffer?.developer.name ?? ""} required />
          </div>
          <div className="space-y-1.5">
            <Label>ABN</Label>
            <Input name="assignee_abn" placeholder="12 345 678 901" />
          </div>
          <div className="space-y-1.5">
            <Label>Address *</Label>
            <Input name="assignee_address" placeholder="123 Collins St, Melbourne VIC 3000" required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Financial terms</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Assignment price (AUD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
              <Input
                name="assignmentPrice"
                type="number"
                step="1000"
                className="pl-7"
                defaultValue={acceptedOffer ? acceptedOffer.offerPrice / 100 : ""}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Developer deposit (AUD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
              <Input name="developerDeposit" type="number" step="1000" className="pl-7" placeholder="50000" required />
            </div>
          </div>
          <div className="text-xs text-zinc-400 p-3 bg-zinc-50 rounded-lg">
            Admin margin = Assignment price − Option price ({formatAud(optionDeed.optionPrice)}) − Option fee ({formatAud(optionDeed.optionFeeAmount)})
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Dates</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Assignment date *</Label>
            <Input name="assignmentDate" type="date" required />
          </div>
          <div className="space-y-1.5">
            <Label>Completion date *</Label>
            <Input name="completionDate" type="date" required />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Generating deed…" : "Generate assignment deed"}
      </Button>
    </form>
  );
}
