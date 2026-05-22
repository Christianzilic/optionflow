import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { ListPropertyForm } from "./list-property-form";
import { STATE_LABELS, formatAud } from "@/lib/property-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ListPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { optionDeed: true },
  });

  if (!property || !["APPROVED", "OPTION_ACTIVE"].includes(property.status)) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/admin/properties/${id}`}>
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back to property</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900">List on marketplace</h1>
        <p className="text-zinc-500 mt-1">
          {property.streetAddress}, {property.suburb} {STATE_LABELS[property.state]}
        </p>
        {property.optionDeed && (
          <p className="text-sm text-zinc-400 mt-1">
            Option price: {formatAud(property.optionDeed.optionPrice)} · Fee: {formatAud(property.optionDeed.optionFeeAmount)}
          </p>
        )}
      </div>

      <LegalDisclaimer />

      <ListPropertyForm propertyId={id} currentListPrice={property.adminListPrice} currentDescription={property.adminDescription} />
    </div>
  );
}
