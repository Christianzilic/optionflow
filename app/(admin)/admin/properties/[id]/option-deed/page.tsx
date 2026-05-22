"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createOptionDeed } from "@/app/actions/deeds";
import { FileText } from "lucide-react";

export default function NewOptionDeedPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    grantor_legalName: "",
    grantor_address: "",
    grantor_abn: "",
    grantee_legalName: process.env.NEXT_PUBLIC_PLATFORM_LEGAL_NAME ?? "",
    grantee_abn: process.env.NEXT_PUBLIC_PLATFORM_ABN ?? "",
    grantee_address: "",
    optionFeeAmount: "",
    optionPrice: "",
    commencementDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    extensionDays: "",
    extensionFeeAmount: "",
    specialConditions: "",
  });

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createOptionDeed({
          propertyId,
          grantor_legalName: form.grantor_legalName,
          grantor_address: form.grantor_address,
          grantor_abn: form.grantor_abn || undefined,
          grantee_legalName: form.grantee_legalName,
          grantee_abn: form.grantee_abn || undefined,
          grantee_address: form.grantee_address,
          optionFeeAmount: Math.round(parseFloat(form.optionFeeAmount) * 100),
          optionPrice: Math.round(parseFloat(form.optionPrice) * 100),
          commencementDate: new Date(form.commencementDate),
          expiryDate: new Date(form.expiryDate),
          extensionDays: form.extensionDays ? parseInt(form.extensionDays) : undefined,
          extensionFeeAmount: form.extensionFeeAmount ? Math.round(parseFloat(form.extensionFeeAmount) * 100) : undefined,
          specialConditions: form.specialConditions || undefined,
        });
        toast.success("Option deed generated and PDF created");
        router.push(`/admin/properties/${propertyId}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to generate deed");
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-zinc-900">Generate option deed</h1>
      </div>

      <LegalDisclaimer />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardHeader><CardTitle className="text-sm">Grantor (property owner)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Legal name *</Label>
              <Input value={form.grantor_legalName} onChange={(e) => set("grantor_legalName", e.target.value)} placeholder="John & Jane Smith" required />
            </div>
            <div className="space-y-1.5">
              <Label>Address *</Label>
              <Input value={form.grantor_address} onChange={(e) => set("grantor_address", e.target.value)} placeholder="123 Main St, Suburb NSW 2000" required />
            </div>
            <div className="space-y-1.5">
              <Label>ABN (if company)</Label>
              <Input value={form.grantor_abn} onChange={(e) => set("grantor_abn", e.target.value)} placeholder="12 345 678 901" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Grantee (your entity)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Legal name *</Label>
              <Input value={form.grantee_legalName} onChange={(e) => set("grantee_legalName", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Address *</Label>
              <Input value={form.grantee_address} onChange={(e) => set("grantee_address", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>ABN</Label>
              <Input value={form.grantee_abn} onChange={(e) => set("grantee_abn", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Option terms</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Option price (AUD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
                  <Input type="number" className="pl-7" value={form.optionPrice} onChange={(e) => set("optionPrice", e.target.value)} placeholder="1,500,000" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Option fee (AUD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
                  <Input type="number" className="pl-7" value={form.optionFeeAmount} onChange={(e) => set("optionFeeAmount", e.target.value)} placeholder="5,000" required />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Commencement date *</Label>
                <Input type="date" value={form.commencementDate} onChange={(e) => set("commencementDate", e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Expiry date *</Label>
                <Input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Extension days</Label>
                <Input type="number" value={form.extensionDays} onChange={(e) => set("extensionDays", e.target.value)} placeholder="30" />
              </div>
              <div className="space-y-1.5">
                <Label>Extension fee (AUD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
                  <Input type="number" className="pl-7" value={form.extensionFeeAmount} onChange={(e) => set("extensionFeeAmount", e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Special conditions</Label>
              <Textarea value={form.specialConditions} onChange={(e) => set("specialConditions", e.target.value)} rows={4} placeholder="Any additional conditions..." />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Generating PDF…" : "Generate option deed PDF"}
        </Button>
      </form>
    </div>
  );
}
