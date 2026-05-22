"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { listProperty } from "@/app/actions/properties";

interface Props {
  propertyId: string;
  currentListPrice?: number | null;
  currentDescription?: string | null;
}

export function ListPropertyForm({ propertyId, currentListPrice, currentDescription }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const priceVal = formData.get("adminListPrice") as string;
    const description = formData.get("adminDescription") as string;

    if (!priceVal || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const adminListPrice = Math.round(parseFloat(priceVal) * 100);

    startTransition(async () => {
      try {
        await listProperty(propertyId, { adminListPrice, adminDescription: description });
        toast.success("Property listed on marketplace");
        router.push(`/admin/properties/${propertyId}`);
      } catch {
        toast.error("Failed to list property");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="adminListPrice">Asking price (AUD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
              <Input
                id="adminListPrice"
                name="adminListPrice"
                type="number"
                step="1000"
                className="pl-7"
                defaultValue={currentListPrice ? currentListPrice / 100 : ""}
                placeholder="1500000"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adminDescription">Marketplace description *</Label>
            <Textarea
              id="adminDescription"
              name="adminDescription"
              rows={6}
              defaultValue={currentDescription ?? ""}
              placeholder="Describe the development opportunity, key features, potential, nearby amenities, and why this site is compelling for developers..."
              required
            />
            <p className="text-xs text-zinc-400">This is what developers will see on the marketplace listing.</p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Publishing…" : "List on marketplace"}
      </Button>
    </form>
  );
}
