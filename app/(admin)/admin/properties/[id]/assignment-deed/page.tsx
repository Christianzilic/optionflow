import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { AssignmentDeedForm } from "./assignment-deed-form";
import { STATE_LABELS, formatAud } from "@/lib/property-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AssignmentDeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      optionDeed: true,
      developerOffers: {
        where: { status: "ACCEPTED" },
        include: { developer: { select: { name: true, email: true } } },
        take: 1,
      },
    },
  });

  if (!property || !property.optionDeed) notFound();

  const acceptedOffer = property.developerOffers[0] ?? null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/admin/properties/${id}`}>
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back to property</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Generate assignment deed</h1>
        <p className="text-zinc-500 mt-1">
          {property.streetAddress}, {property.suburb} {STATE_LABELS[property.state]}
        </p>
        <p className="text-sm text-zinc-400 mt-1">
          Original option price: {formatAud(property.optionDeed.optionPrice)}
        </p>
      </div>

      <LegalDisclaimer />

      <AssignmentDeedForm
        propertyId={id}
        optionDeed={property.optionDeed}
        acceptedOffer={acceptedOffer}
      />
    </div>
  );
}
