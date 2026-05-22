"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { createPropertyDraft, submitProperty } from "@/app/actions/properties";
import { AU_STATES, STATE_LABELS, PROPERTY_TYPES } from "@/lib/property-utils";
import type { AustralianState } from "@/lib/generated/prisma/client";

const STEPS = ["Location", "Property details", "Development potential", "Review & submit"];

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [legalAck, setLegalAck] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  const [form, setForm] = useState({
    streetAddress: "",
    suburb: "",
    state: "" as AustralianState,
    postcode: "",
    lotNumber: "",
    planNumber: "",
    titleReference: "",
    landAreaSqm: "",
    currentZoning: "",
    proposedZoning: "",
    propertyType: "house",
    bedroomCount: "",
    bathroomCount: "",
    carSpaces: "",
    yearBuilt: "",
    currentUse: "",
    proposedDevelopment: "",
    homeownerAskingPrice: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function parseNum(v: string) { const n = parseInt(v); return isNaN(n) ? undefined : n; }

  async function handleNext() {
    if (step === STEPS.length - 1) {
      if (!legalAck) { toast.error("Please acknowledge the legal disclaimer to proceed."); return; }
      startTransition(async () => {
        try {
          let id = draftId;
          if (!id) {
            const draft = await createPropertyDraft({
              streetAddress: form.streetAddress,
              suburb: form.suburb,
              state: form.state,
              postcode: form.postcode,
              lotNumber: form.lotNumber || undefined,
              planNumber: form.planNumber || undefined,
              titleReference: form.titleReference || undefined,
              landAreaSqm: parseNum(form.landAreaSqm),
              currentZoning: form.currentZoning || undefined,
              proposedZoning: form.proposedZoning || undefined,
              propertyType: form.propertyType,
              bedroomCount: parseNum(form.bedroomCount),
              bathroomCount: parseNum(form.bathroomCount),
              carSpaces: parseNum(form.carSpaces),
              yearBuilt: parseNum(form.yearBuilt),
              currentUse: form.currentUse || undefined,
              proposedDevelopment: form.proposedDevelopment || undefined,
              homeownerAskingPrice: form.homeownerAskingPrice ? Math.round(parseFloat(form.homeownerAskingPrice) * 100) : undefined,
            });
            id = draft.id;
            setDraftId(id);
          }
          await submitProperty(id, new Date());
          toast.success("Property submitted for review!");
          router.push("/homeowner/dashboard");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        }
      });
      return;
    }
    setStep((s) => s + 1);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Submit a property</h1>
        <p className="text-sm text-zinc-500 mt-1">Tell us about your property and its development potential.</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? "text-blue-600 font-medium" : ""}>{s}</span>
          ))}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Step 1: Location */}
      {step === 0 && (
        <div className="space-y-4 bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-zinc-800">Property location</h2>
          <div className="space-y-1.5">
            <Label>Street address *</Label>
            <Input placeholder="123 Main Street" value={form.streetAddress} onChange={(e) => set("streetAddress", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Suburb *</Label>
              <Input placeholder="Suburb" value={form.suburb} onChange={(e) => set("suburb", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Postcode *</Label>
              <Input placeholder="2000" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} maxLength={4} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>State / Territory *</Label>
            <Select value={form.state} onValueChange={(v) => v !== null && set("state", v)}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {AU_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{STATE_LABELS[s]} ({s})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Lot number</Label>
              <Input placeholder="e.g. 42" value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Plan number</Label>
              <Input placeholder="e.g. DP 123456" value={form.planNumber} onChange={(e) => set("planNumber", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Title reference</Label>
              <Input placeholder="e.g. CT 5001/200" value={form.titleReference} onChange={(e) => set("titleReference", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Property details */}
      {step === 1 && (
        <div className="space-y-4 bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-zinc-800">Property details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Property type *</Label>
              <Select value={form.propertyType} onValueChange={(v) => v !== null && set("propertyType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Land area (m²)</Label>
              <Input type="number" placeholder="e.g. 650" value={form.landAreaSqm} onChange={(e) => set("landAreaSqm", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Bedrooms</Label>
              <Input type="number" placeholder="3" value={form.bedroomCount} onChange={(e) => set("bedroomCount", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Bathrooms</Label>
              <Input type="number" placeholder="1" value={form.bathroomCount} onChange={(e) => set("bathroomCount", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Car spaces</Label>
              <Input type="number" placeholder="1" value={form.carSpaces} onChange={(e) => set("carSpaces", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Year built</Label>
              <Input type="number" placeholder="1985" value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Current zoning</Label>
              <Input placeholder="e.g. R2, MU1" value={form.currentZoning} onChange={(e) => set("currentZoning", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Current use</Label>
            <Textarea placeholder="Describe how the property is currently used..." value={form.currentUse} onChange={(e) => set("currentUse", e.target.value)} rows={3} />
          </div>
        </div>
      )}

      {/* Step 3: Development potential */}
      {step === 2 && (
        <div className="space-y-4 bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-zinc-800">Development potential</h2>
          <div className="space-y-1.5">
            <Label>Proposed development (optional)</Label>
            <Textarea
              placeholder="What do you think this site could be developed into? e.g. 'Corner block suitable for townhouses', 'Large lot with DA potential for units'"
              value={form.proposedDevelopment}
              onChange={(e) => set("proposedDevelopment", e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Proposed zoning (if known)</Label>
            <Input placeholder="e.g. R4 High Density" value={form.proposedZoning} onChange={(e) => set("proposedZoning", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Your asking price (optional, AUD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">$</span>
              <Input
                type="number"
                placeholder="1,500,000"
                className="pl-7"
                value={form.homeownerAskingPrice}
                onChange={(e) => set("homeownerAskingPrice", e.target.value)}
              />
            </div>
            <p className="text-xs text-zinc-400">This is indicative only. The final agreed price will be set in the option deed.</p>
          </div>
        </div>
      )}

      {/* Step 4: Review & submit */}
      {step === 3 && (
        <div className="space-y-4">
          <LegalDisclaimer />
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-zinc-800">Review your submission</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Address</dt>
                <dd className="font-medium">{form.streetAddress}, {form.suburb} {form.state} {form.postcode}</dd>
              </div>
              {form.landAreaSqm && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Land area</dt>
                  <dd className="font-medium">{form.landAreaSqm} m²</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-500">Property type</dt>
                <dd className="font-medium">{PROPERTY_TYPES.find((t) => t.value === form.propertyType)?.label}</dd>
              </div>
              {form.homeownerAskingPrice && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Asking price</dt>
                  <dd className="font-medium">${parseFloat(form.homeownerAskingPrice).toLocaleString()}</dd>
                </div>
              )}
            </dl>
            <div className="border-t pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalAck}
                  onChange={(e) => setLegalAck(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-blue-600"
                />
                <span className="text-xs text-zinc-500 leading-relaxed">
                  I acknowledge that I have read the legal disclaimer and understand that OptionFlow does not provide legal advice. I have had the opportunity to seek independent legal advice before submitting this property. I confirm I am the owner or authorised representative for this property.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isPending || (step === 0 && (!form.streetAddress || !form.suburb || !form.state || !form.postcode))}
        >
          {isPending ? "Submitting…" : step === STEPS.length - 1 ? "Submit property" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
