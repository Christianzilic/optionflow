import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalDisclaimer } from "@/components/ui/legal-disclaimer";
import { Separator } from "@/components/ui/separator";
import { propertyStatusLabel, propertyStatusColor, formatAud, optionDeedStatusLabel, STATE_LABELS } from "@/lib/property-utils";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { AdminPropertyActions } from "./admin-property-actions";
import { SendForSigningButton } from "./send-for-signing-button";

export default async function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: { include: { homeownerProfile: true } },
      optionDeed: true,
      assignmentDeed: true,
      developerOffers: { include: { developer: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      enquiries: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!property) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-zinc-900">{property.streetAddress}</h1>
            <Badge className={propertyStatusColor(property.status)}>{propertyStatusLabel(property.status)}</Badge>
          </div>
          <p className="text-zinc-500">{property.suburb}, {STATE_LABELS[property.state]} ({property.state}) {property.postcode}</p>
          <p className="text-xs text-zinc-400 mt-1">
            Submitted {property.submittedAt ? formatDistanceToNow(property.submittedAt, { addSuffix: true }) : "—"}
            {" · "}Updated {formatDistanceToNow(property.updatedAt, { addSuffix: true })}
          </p>
        </div>
      </div>

      <LegalDisclaimer />

      {/* Actions */}
      <AdminPropertyActions property={property} />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property info */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Property details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Type" value={property.propertyType} />
            <Row label="Land area" value={property.landAreaSqm ? `${property.landAreaSqm.toLocaleString()} m²` : null} />
            <Row label="Lot / Plan" value={[property.lotNumber, property.planNumber].filter(Boolean).join(" / ") || null} />
            <Row label="Title reference" value={property.titleReference} />
            <Row label="Current zoning" value={property.currentZoning} />
            <Row label="Proposed zoning" value={property.proposedZoning} />
            <Row label="Bedrooms" value={property.bedroomCount?.toString()} />
            <Row label="Bathrooms" value={property.bathroomCount?.toString()} />
            <Row label="Year built" value={property.yearBuilt?.toString()} />
          </CardContent>
        </Card>

        {/* Owner info */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Owner</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Name" value={property.owner.name} />
            <Row label="Email" value={property.owner.email} />
            <Row label="Phone" value={property.owner.phone} />
            <Row label="Legal name" value={property.owner.homeownerProfile?.legalName} />
            <Row label="ABN" value={property.owner.homeownerProfile?.abn} />
            <Separator />
            <Row label="Asking price" value={property.homeownerAskingPrice ? formatAud(property.homeownerAskingPrice) : null} />
            <Row label="Agreed option price" value={property.agreedOptionPrice ? formatAud(property.agreedOptionPrice) : null} />
            <Row label="Admin list price" value={property.adminListPrice ? formatAud(property.adminListPrice) : null} />
          </CardContent>
        </Card>

        {/* Development notes */}
        {property.proposedDevelopment && (
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-sm">Proposed development</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 whitespace-pre-wrap">{property.proposedDevelopment}</p>
            </CardContent>
          </Card>
        )}

        {/* Option deed */}
        {property.optionDeed && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Option deed</CardTitle>
              <Badge variant="secondary">{optionDeedStatusLabel(property.optionDeed.status)}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Option fee" value={formatAud(property.optionDeed.optionFeeAmount)} />
              <Row label="Option price" value={formatAud(property.optionDeed.optionPrice)} />
              <Row label="Commencement" value={format(property.optionDeed.commencementDate, "d MMM yyyy")} />
              <Row label="Expiry" value={format(property.optionDeed.expiryDate, "d MMM yyyy")} />
              {property.optionDeed.signedAt && (
                <Row label="Signed" value={format(property.optionDeed.signedAt, "d MMM yyyy")} />
              )}
              <div className="pt-2 flex gap-2 flex-wrap">
                {property.optionDeed.draftPdfKey && (
                  <Link href={`/api/option-deeds/${property.optionDeed.id}/preview`} target="_blank">
                    <Button size="sm" variant="outline">View draft PDF</Button>
                  </Link>
                )}
                {property.optionDeed.signedPdfKey && (
                  <Link href={`/api/option-deeds/${property.optionDeed.id}/preview`} target="_blank">
                    <Button size="sm" variant="outline">View signed PDF</Button>
                  </Link>
                )}
                {property.optionDeed.status === "DRAFT" && (
                  <SendForSigningButton deedId={property.optionDeed.id} deedType="option" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment deed */}
        {property.assignmentDeed && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Assignment deed</CardTitle>
              <Badge variant="secondary">{property.assignmentDeed.status.replace(/_/g, " ")}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Assignee" value={property.assignmentDeed.assignee_legalName} />
              <Row label="Assignment price" value={formatAud(property.assignmentDeed.assignmentPrice)} />
              <Row label="Admin margin" value={formatAud(property.assignmentDeed.adminMargin)} />
              <Row label="Developer deposit" value={formatAud(property.assignmentDeed.developerDeposit)} />
              {property.assignmentDeed.signedAt && (
                <Row label="Signed" value={format(property.assignmentDeed.signedAt, "d MMM yyyy")} />
              )}
              <div className="pt-2 flex gap-2 flex-wrap">
                {property.assignmentDeed.draftPdfKey && (
                  <Link href={`/api/assignment-deeds/${property.assignmentDeed.id}/preview`} target="_blank">
                    <Button size="sm" variant="outline">View draft PDF</Button>
                  </Link>
                )}
                {property.assignmentDeed.status === "DRAFT" && (
                  <SendForSigningButton deedId={property.assignmentDeed.id} deedType="assignment" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Developer offers */}
        {property.developerOffers.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Developer offers ({property.developerOffers.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {property.developerOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between text-sm border rounded-lg p-3">
                  <div>
                    <div className="font-medium">{offer.developer.name ?? offer.developer.email}</div>
                    <div className="text-zinc-500">{formatAud(offer.offerPrice)}</div>
                  </div>
                  <Badge variant="secondary">{offer.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Admin notes */}
      {property.adminNotes && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader><CardTitle className="text-sm text-amber-800">Admin notes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900 whitespace-pre-wrap">{property.adminNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
